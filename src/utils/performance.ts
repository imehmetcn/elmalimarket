'use client';

// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Core Web Vitals monitoring
    this.observeWebVitals();
    
    // Navigation timing
    this.observeNavigation();
    
    // Resource timing
    this.observeResources();
    
    // Long tasks
    this.observeLongTasks();
  }

  private observeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.recordMetric('LCP', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private observeNavigation(): void {
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('TTFB', entry.responseStart - entry.requestStart);
          this.recordMetric('DOM_LOAD', entry.domContentLoadedEventEnd - entry.navigationStart);
          this.recordMetric('WINDOW_LOAD', entry.loadEventEnd - entry.navigationStart);
        });
      });
      
      try {
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navObserver);
      } catch (e) {
        console.warn('Navigation observer not supported');
      }
    }
  }

  private observeResources(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const resourceType = entry.initiatorType;
          const loadTime = entry.responseEnd - entry.startTime;
          
          this.recordMetric(`RESOURCE_${resourceType.toUpperCase()}`, loadTime);
          
          // Track slow resources
          if (loadTime > 1000) {
            console.warn(`Slow resource detected: ${entry.name} (${loadTime}ms)`);
          }
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private observeLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('LONG_TASK', entry.duration);
          console.warn(`Long task detected: ${entry.duration}ms`);
        });
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (e) {
        console.warn('Long task observer not supported');
      }
    }
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
    
    // Send to analytics if configured
    this.sendToAnalytics(name, value);
  }

  private sendToAnalytics(name: string, value: number): void {
    // Send to Google Analytics, custom analytics, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        custom_parameter: 'elmali_market'
      });
    }
  }

  // Public methods
  getMetric(name: string): number[] {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name: string): number {
    const values = this.getMetric(name);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetricPercentile(name: string, percentile: number): number {
    const values = this.getMetric(name).sort((a, b) => a - b);
    if (values.length === 0) return 0;
    
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index];
  }

  getAllMetrics(): Record<string, { avg: number; p95: number; count: number }> {
    const result: Record<string, { avg: number; p95: number; count: number }> = {};
    
    this.metrics.forEach((values, name) => {
      result[name] = {
        avg: this.getAverageMetric(name),
        p95: this.getMetricPercentile(name, 95),
        count: values.length,
      };
    });
    
    return result;
  }

  // Manual timing methods
  startTiming(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      this.recordMetric(name, endTime - startTime);
    };
  }

  timeFunction<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T {
    return ((...args: any[]) => {
      const endTiming = this.startTiming(name);
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(endTiming);
      } else {
        endTiming();
        return result;
      }
    }) as T;
  }

  // Memory monitoring
  getMemoryInfo(): any {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  // Connection monitoring
  getConnectionInfo(): any {
    if ('connection' in navigator) {
      return (navigator as any).connection;
    }
    return null;
  }

  // Performance recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getAllMetrics();
    
    // LCP recommendations
    if (metrics.LCP && metrics.LCP.avg > 2500) {
      recommendations.push('LCP is slow. Consider optimizing images and critical resources.');
    }
    
    // FID recommendations
    if (metrics.FID && metrics.FID.avg > 100) {
      recommendations.push('FID is high. Consider reducing JavaScript execution time.');
    }
    
    // CLS recommendations
    if (metrics.CLS && metrics.CLS.avg > 0.1) {
      recommendations.push('CLS is high. Ensure images and ads have dimensions set.');
    }
    
    // Long tasks
    if (metrics.LONG_TASK && metrics.LONG_TASK.count > 0) {
      recommendations.push('Long tasks detected. Consider code splitting and lazy loading.');
    }
    
    // Resource loading
    if (metrics.RESOURCE_IMAGE && metrics.RESOURCE_IMAGE.avg > 1000) {
      recommendations.push('Images are loading slowly. Consider optimization and lazy loading.');
    }
    
    return recommendations;
  }

  // Cleanup
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  static async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        }, file.type);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  static generatePlaceholder(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width;
    canvas.height = height;
    
    // Create gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  }
}

// Bundle analyzer utility
export class BundleAnalyzer {
  static analyzeChunks(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsChunks = entries.filter(entry => 
        entry.name.includes('/_next/static/chunks/') && entry.name.endsWith('.js')
      );
      
      console.group('Bundle Analysis');
      console.log(`Total JS chunks: ${jsChunks.length}`);
      
      jsChunks.forEach(chunk => {
        const size = chunk.transferSize || 0;
        const loadTime = chunk.responseEnd - chunk.startTime;
        console.log(`${chunk.name.split('/').pop()}: ${(size / 1024).toFixed(2)}KB (${loadTime.toFixed(2)}ms)`);
      });
      
      console.groupEnd();
    }
  }

  static getUnusedCSS(): string[] {
    const unusedRules: string[] = [];
    
    if (typeof document !== 'undefined') {
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (rule instanceof CSSStyleRule) {
              try {
                if (!document.querySelector(rule.selectorText)) {
                  unusedRules.push(rule.selectorText);
                }
              } catch (e) {
                // Invalid selector
              }
            }
          });
        } catch (e) {
          // Cross-origin stylesheet
        }
      });
    }
    
    return unusedRules;
  }
}

// Export singleton
export const performanceMonitor = PerformanceMonitor.getInstance();