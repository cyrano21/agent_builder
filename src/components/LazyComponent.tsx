'use client';

import { lazy, Suspense, ComponentType, LazyExoticComponent, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
}

function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function LazyComponent({ 
  loader, 
  fallback = <LoadingSpinner />, 
  className,
  ...props 
}: LazyComponentProps) {
  const LazyComponent = lazy(loader);

  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </div>
  );
}

// Predefined lazy components for common heavy components
export const LazyChart = lazy(() => import('@/components/ui/chart'));
export const LazyEditor = lazy(() => import('@mdxeditor/editor'));
export const LazyTable = lazy(() => import('@/components/ui/table'));

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyWrappedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Hook for intersection observer based lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
}