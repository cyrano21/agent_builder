// Performance monitoring utilities
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceThreshold {
  warning: number;
  critical: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private observers: Array<(metric: PerformanceMetric) => void> = [];

  constructor() {
    // Set default thresholds
    this.setThreshold('pageLoad', { warning: 3000, critical: 5000 });
    this.setThreshold('apiCall', { warning: 1000, critical: 3000 });
    this.setThreshold('renderTime', { warning: 100, critical: 300 });
    this.setThreshold('dbQuery', { warning: 500, critical: 1500 });
    this.setThreshold('memoryUsage', { warning: 50, critical: 80 }); // MB

    // Start monitoring
    this.startMonitoring();
  }

  // Set performance thresholds
  setThreshold(name: string, threshold: PerformanceThreshold): void {
    this.thresholds.set(name, threshold);
  }

  // Add performance observer
  addObserver(observer: (metric: PerformanceMetric) => void): void {
    this.observers.push(observer);
  }

  // Remove performance observer
  removeObserver(observer: (metric: PerformanceMetric) => void): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check thresholds and notify observers
    this.checkThresholds(metric);
    this.notifyObservers(metric);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}ms`, metadata);
    }
  }

  // Check if metric exceeds thresholds
  private checkThresholds(metric: PerformanceMetric): void {
    const threshold = this.thresholds.get(metric.name);
    if (!threshold) return;

    if (metric.value > threshold.critical) {
      console.error(`[Performance Critical] ${metric.name}: ${metric.value} exceeds critical threshold ${threshold.critical}`);
      this.sendAlert('critical', metric);
    } else if (metric.value > threshold.warning) {
      console.warn(`[Performance Warning] ${metric.name}: ${metric.value} exceeds warning threshold ${threshold.warning}`);
      this.sendAlert('warning', metric);
    }
  }

  // Notify all observers
  private notifyObservers(metric: PerformanceMetric): void {
    this.observers.forEach(observer => {
      try {
        observer(metric);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  // Send alert (could be extended to send to external services)
  private sendAlert(level: 'warning' | 'critical', metric: PerformanceMetric): void {
    // In a real application, this could send to Sentry, Datadog, etc.
    const alert = {
      level,
      metric: metric.name,
      value: metric.value,
      timestamp: metric.timestamp,
      metadata: metric.metadata
    };

    console.log('[Performance Alert]', alert);
  }

  // Start monitoring various performance aspects
  private startMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('pageLoad', navigation.loadEventEnd - navigation.loadEventStart);
      }
    });

    // Monitor API calls
    this.monitorAPICalls();

    // Monitor memory usage
    this.monitorMemoryUsage();

    // Monitor render performance
    this.monitorRenderPerformance();
  }

  // Monitor API calls
  private monitorAPICalls(): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const start = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        
        this.recordMetric('apiCall', duration, {
          url: args[0],
          method: args[1]?.method || 'GET',
          status: response.status
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - start;
        this.recordMetric('apiCall', duration, {
          url: args[0],
          method: args[1]?.method || 'GET',
          error: true
        });
        throw error;
      }
    };
  }

  // Monitor memory usage
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          this.recordMetric('memoryUsage', memory.usedJSHeapSize / 1024 / 1024, {
            total: memory.totalJSHeapSize / 1024 / 1024,
            limit: memory.jsHeapSizeLimit / 1024 / 1024
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Monitor render performance
  private monitorRenderPerformance(): void {
    let lastFrameTime = performance.now();
    
    const measureFrameTime = () => {
      const now = performance.now();
      const frameTime = now - lastFrameTime;
      lastFrameTime = now;
      
      this.recordMetric('renderTime', frameTime);
      
      requestAnimationFrame(measureFrameTime);
    };
    
    requestAnimationFrame(measureFrameTime);
  }

  // Get performance statistics
  getStats(name?: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  } {
    const metrics = name 
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;

    if (metrics.length === 0) {
      return {
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        p95: 0,
        p99: 0
      };
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return {
      count: values.length,
      average: sum / values.length,
      min: values[0],
      max: values[values.length - 1],
      p95: values[Math.floor(values.length * 0.95)],
      p99: values[Math.floor(values.length * 0.99)]
    };
  }

  // Get recent metrics
  getRecentMetrics(name?: string, limit: number = 100): PerformanceMetric[] {
    const metrics = name 
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;
    
    return metrics.slice(-limit);
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Generate performance report
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {},
      stats: {}
    };

    // Group metrics by name
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, PerformanceMetric[]>);

    // Generate stats for each metric
    Object.keys(grouped).forEach(name => {
      report.metrics[name] = grouped[name];
      report.stats[name] = this.getStats(name);
    });

    return JSON.stringify(report, null, 2);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance measurement utilities
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  performanceMonitor.recordMetric(name, duration, metadata);
  
  return result;
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  performanceMonitor.recordMetric(name, duration, metadata);
  
  return result;
}