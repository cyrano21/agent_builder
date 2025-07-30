// Bundle optimization utilities
export class BundleOptimizer {
  // Dynamic import utilities for code splitting
  static dynamicImports = {
    // Heavy components that should be loaded on demand
    components: {
      chart: () => import('@/components/ui/chart'),
      editor: () => import('@mdxeditor/editor'),
      table: () => import('@/components/ui/table'),
      calendar: () => import('@/components/ui/calendar'),
      dialog: () => import('@/components/ui/dialog'),
      popover: () => import('@/components/ui/popover'),
      tooltip: () => import('@/components/ui/tooltip'),
    },
    
    // Libraries that are only needed in specific contexts
    libraries: {
      // Only load chart library when needed
      recharts: () => import('recharts'),
      // Only load markdown parser when needed
      markdown: () => import('react-markdown'),
      // Only load syntax highlighter when needed
      syntaxHighlighter: () => import('react-syntax-highlighter'),
    }
  };

  // Route-based code splitting
  static getRouteComponent(route: string) {
    const routeComponents: Record<string, () => Promise<any>> = {
      '/dashboard': () => import('@/app/dashboard/page'),
      '/projects': () => import('@/app/projects/page'),
      '/billing': () => import('@/app/billing/page'),
      '/settings': () => import('@/app/settings/page'),
      '/auth': () => import('@/app/auth/page'),
    };

    return routeComponents[route] || (() => import('@/app/page'));
  }

  // Lazy load images and other assets
  static lazyLoadAssets() {
    if (typeof window === 'undefined') return;

    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Prefetch critical resources
  static prefetchCriticalResources() {
    if (typeof window === 'undefined') return;

    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var.woff',
      '/icons/favicon.ico',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Optimize font loading
  static optimizeFontLoading() {
    if (typeof window === 'undefined') return;

    // Load fonts asynchronously
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  }

  // Detect and report large bundles
  static analyzeBundleSize() {
    if (typeof window === 'undefined') return;

    // Monitor bundle size and performance
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const bundleSize = navigation.transferSize;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

      console.log(`Bundle size: ${(bundleSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Load time: ${loadTime.toFixed(2)} ms`);

      // Report if bundle is too large
      if (bundleSize > 2 * 1024 * 1024) { // > 2MB
        console.warn('Bundle size is larger than recommended (2MB)');
      }
    }
  }

  // Optimize third-party scripts
  static optimizeThirdPartyScripts() {
    if (typeof window === 'undefined') return;

    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script[src]:not([critical])');
    scripts.forEach(script => {
      script.setAttribute('defer', '');
    });
  }

  // Service worker registration for caching
  static registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }

  // Resource hints optimization
  static addResourceHints() {
    if (typeof window === 'undefined') return;

    const hints = [
      // DNS prefetch for external domains
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      
      // Preconnect for critical domains
      { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }
}