'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps<T> {
  items: T[];
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
  children: (item: T, index: number) => React.ReactNode;
}

export function InfiniteScroll<T>({
  items,
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 100,
  loader,
  endMessage,
  className,
  children
}: InfiniteScrollProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || loading || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, loading, hasMore, onLoadMore]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, isLoadingMore, loadMore, threshold]);

  const defaultLoader = (
    <div className="flex justify-center py-4">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-4 text-muted-foreground">
      Fin des résultats
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => children(item, index))}
      
      {(hasMore || loading) && (
        <div ref={loadMoreRef}>
          {loader || defaultLoader}
        </div>
      )}
      
      {!hasMore && !loading && items.length > 0 && (
        <div>
          {endMessage || defaultEndMessage}
        </div>
      )}
    </div>
  );
}

// Virtualized list for very large datasets
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            width: '100%'
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for infinite scroll data management
export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ items: T[]; total: number }>,
  initialLimit: number = 20
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchFunction(page, initialLimit);
      
      setItems(prev => [...prev, ...result.items]);
      setTotal(result.total);
      setHasMore(prev => prev && result.items.length === initialLimit);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, initialLimit, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setLoading(false);
    setHasMore(true);
    setPage(1);
    setTotal(0);
  }, []);

  return {
    items,
    loading,
    hasMore,
    total,
    loadMore,
    reset
  };
}