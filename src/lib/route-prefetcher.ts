// Route prefetching utilities
import { useRouter } from 'next/router';
import { useEffect, useRef, useCallback } from 'react';
import React from 'react';

interface RouteConfig {
  path: string;
  priority: 'high' | 'medium' | 'low';
  preload?: boolean;
  when?: 'idle' | 'hover' | 'visible';
}

class RoutePrefetcher {
  private prefetchedRoutes = new Set<string>();
  private observer: IntersectionObserver | null = null;
  private hoverTimeouts = new Map<string, NodeJS.Timeout>();

  // Predefined route configurations
  private routeConfigs: RouteConfig[] = [
    { path: '/dashboard', priority: 'high', when: 'idle' },
    { path: '/projects', priority: 'high', when: 'idle' },
    { path: '/billing', priority: 'medium', when: 'hover' },
    { path: '/settings', priority: 'medium', when: 'hover' },
    { path: '/auth', priority: 'low', when: 'visible' },
    { path: '/about', priority: 'low', when: 'visible' },
    { path: '/contact', priority: 'low', when: 'visible' },
    { path: '/privacy', priority: 'low', when: 'visible' },
    { path: '/terms', priority: 'low', when: 'visible' },
    { path: '/security', priority: 'low', when: 'visible' },
  ];

  constructor() {
    this.initializeObserver();
    this.setupEventListeners();
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const route = entry.target.getAttribute('data-route');
            if (route) {
              this.prefetchRoute(route);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.1
      }
    );
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.prefetchHighPriorityRoutes();
      });
    } else {
      setTimeout(() => {
        this.prefetchHighPriorityRoutes();
      }, 2000);
    }

    this.setupHoverPrefetching();
  }

  private setupHoverPrefetching(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a') as HTMLAnchorElement;
      
      if (linkElement && linkElement.href) {
        const route = new URL(linkElement.href).pathname;
        const config = this.routeConfigs.find(c => c.path === route);
        
        if (config && config.when === 'hover') {
          this.scheduleHoverPrefetch(route);
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a') as HTMLAnchorElement;
      
      if (linkElement && linkElement.href) {
        const route = new URL(linkElement.href).pathname;
        this.cancelHoverPrefetch(route);
      }
    });
  }

  private scheduleHoverPrefetch(route: string): void {
    this.cancelHoverPrefetch(route);

    const timeoutId = setTimeout(() => {
      this.prefetchRoute(route);
    }, 100);

    this.hoverTimeouts.set(route, timeoutId);
  }

  private cancelHoverPrefetch(route: string): void {
    const timeoutId = this.hoverTimeouts.get(route);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.hoverTimeouts.delete(route);
    }
  }

  private prefetchHighPriorityRoutes(): void {
    const highPriorityRoutes = this.routeConfigs
      .filter(config => config.priority === 'high' && config.when === 'idle')
      .map(config => config.path);

    highPriorityRoutes.forEach(route => {
      this.prefetchRoute(route);
    });
  }

  prefetchRoute(route: string): void {
    if (this.prefetchedRoutes.has(route)) return;

    // Use Next.js router prefetch if available, otherwise fallback to link prefetch
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    }

    this.prefetchedRoutes.add(route);
    console.log(`[RoutePrefetcher] Prefetched: ${route}`);
  }

  observeElement(element: HTMLElement, route: string): void {
    if (this.observer) {
      element.setAttribute('data-route', route);
      this.observer.observe(element);
    }
  }

  unobserveElement(element: HTMLElement): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  isPrefetched(route: string): boolean {
    return this.prefetchedRoutes.has(route);
  }

  clearPrefetchedRoutes(): void {
    this.prefetchedRoutes.clear();
  }

  prefetchLikelyRoutes(currentRoute: string): void {
    const likelyRoutes = this.getLikelyRoutes(currentRoute);
    
    likelyRoutes.forEach(route => {
      if (!this.prefetchedRoutes.has(route)) {
        this.prefetchRoute(route);
      }
    });
  }

  private getLikelyRoutes(currentRoute: string): string[] {
    const navigationPatterns: Record<string, string[]> = {
      '/dashboard': ['/projects', '/settings', '/billing'],
      '/projects': ['/dashboard', '/settings'],
      '/settings': ['/dashboard', '/billing'],
      '/billing': ['/settings', '/dashboard'],
      '/auth': ['/dashboard'],
      '/': ['/dashboard', '/about', '/contact'],
    };

    return navigationPatterns[currentRoute] || [];
  }

  prefetchAllRoutes(): void {
    this.routeConfigs.forEach(config => {
      this.prefetchRoute(config.path);
    });
  }
}

export const routePrefetcher = new RoutePrefetcher();

export function useRoutePrefetcher() {
  const prefetchRoute = useCallback((route: string) => {
    routePrefetcher.prefetchRoute(route);
  }, []);

  const prefetchLikelyRoutes = useCallback((currentRoute: string) => {
    routePrefetcher.prefetchLikelyRoutes(currentRoute);
  }, []);

  return { prefetchRoute, prefetchLikelyRoutes };
}

export function useVisiblePrefetch(route: string, elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    routePrefetcher.observeElement(element, route);

    return () => {
      routePrefetcher.unobserveElement(element);
    };
  }, [route, elementRef]);
}

export function useInteractionPrefetch() {
  const handleInteraction = useCallback((route: string) => {
    routePrefetcher.prefetchRoute(route);
  }, []);

  return { handleInteraction };
}

interface RoutePrefetcherProps {
  route: string;
  strategy?: 'visible' | 'hover' | 'idle';
  children: React.ReactNode;
}

export function RoutePrefetcherWrapper({ 
  route, 
  strategy = 'visible', 
  children 
}: RoutePrefetcherProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (strategy === 'idle') {
      routePrefetcher.prefetchRoute(route);
    } else if (strategy === 'visible' && elementRef.current) {
      routePrefetcher.observeElement(elementRef.current, route);
    }

    return () => {
      if (strategy === 'visible' && elementRef.current) {
        routePrefetcher.unobserveElement(elementRef.current);
      }
    };
  }, [route, strategy]);

  const handleMouseEnter = useCallback(() => {
    if (strategy === 'hover') {
      routePrefetcher.prefetchRoute(route);
    }
  }, [route, strategy]);

  const divProps = {
    ref: elementRef,
    onMouseEnter: handleMouseEnter
  };

  return React.createElement('div', divProps, children);
}

export function useNavigationPrefetch() {
  useEffect(() => {
    const currentPath = window.location.pathname;
    routePrefetcher.prefetchLikelyRoutes(currentPath);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const links = element.querySelectorAll('a[href]');
            
            links.forEach((link) => {
              const href = link.getAttribute('href');
              if (href && href.startsWith('/')) {
                link.addEventListener('mouseenter', () => {
                  routePrefetcher.prefetchRoute(href);
                });
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}