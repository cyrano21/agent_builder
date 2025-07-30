// Simple in-memory cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  set<T>(key: string, data: T, ttl: number = 300000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Global cache instance
export const cache = new MemoryCache();

// Cache decorator for functions
export function cached<T>(keyPrefix: string, ttl: number = 300000) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
  ) {
    const method = descriptor.value!;
    
    descriptor.value = async function (...args: any[]): Promise<T> {
      const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cachedResult = cache.get<T>(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }
      
      // Execute the original method
      const result = await method.apply(this, args);
      
      // Cache the result
      cache.set(cacheKey, result, ttl);
      
      return result;
    };
    
    return descriptor;
  };
}