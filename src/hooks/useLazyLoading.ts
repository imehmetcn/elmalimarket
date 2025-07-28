'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performance';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  trackPerformance?: boolean;
}

export function useLazyLoading({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  trackPerformance = true,
}: UseLazyLoadingOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and triggerOnce is true, don't observe
    if (hasTriggered && triggerOnce) return;

    // Create observer with performance tracking
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        if (trackPerformance && isVisible && !hasTriggered) {
          // Track lazy loading performance
          const loadTime = performance.now();
          performanceMonitor.startTiming('LAZY_LOAD_TRIGGER');
        }
        
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          setHasTriggered(true);
          // Disconnect observer after first trigger for performance
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, trackPerformance]);

  return {
    ref,
    isIntersecting: triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting,
    hasTriggered,
  };
}

// Enhanced hook for lazy loading images with performance tracking
export function useLazyImage(src: string, options?: UseLazyLoadingOptions & { 
  preload?: boolean;
  priority?: boolean;
}) {
  const { preload = false, priority = false, ...lazyOptions } = options || {};
  const { ref, isIntersecting } = useLazyLoading({
    ...lazyOptions,
    trackPerformance: true,
  });
  
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    priority ? src : undefined
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadStartTime = useRef<number>(0);

  // Preload image when intersecting
  useEffect(() => {
    if ((isIntersecting || priority) && !imageSrc && !isLoading) {
      setIsLoading(true);
      loadStartTime.current = performance.now();
      
      if (preload) {
        // Preload image before setting src
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          setIsLoading(false);
        };
        img.onerror = () => {
          setError('Failed to load image');
          setIsLoading(false);
        };
        img.src = src;
      } else {
        setImageSrc(src);
        setIsLoading(false);
      }
    }
  }, [isIntersecting, src, imageSrc, isLoading, preload, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    
    // Track image loading performance
    if (loadStartTime.current > 0) {
      const loadTime = performance.now() - loadStartTime.current;
      performanceMonitor.startTiming('IMAGE_LOAD_TIME')();
      
      // Log slow images
      if (loadTime > 1000) {
        console.warn(`Slow image load detected: ${src} (${loadTime}ms)`);
      }
    }
  }, [src]);

  const handleError = useCallback(() => {
    setError('Failed to load image');
    setIsLoaded(false);
  }, []);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isLoading,
    error,
    isIntersecting,
    onLoad: handleLoad,
    onError: handleError,
  };
}

// Hook for lazy loading components
export function useLazyComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options?: UseLazyLoadingOptions
) {
  const { ref, isIntersecting } = useLazyLoading(options);
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isIntersecting && !Component && !isLoading) {
      setIsLoading(true);
      const startTime = performance.now();
      
      importFn()
        .then((module) => {
          setComponent(() => module.default);
          setIsLoading(false);
          
          // Track component loading time
          const loadTime = performance.now() - startTime;
          performanceMonitor.startTiming('COMPONENT_LAZY_LOAD')();
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isIntersecting, Component, isLoading, importFn]);

  return {
    ref,
    Component,
    isLoading,
    error,
    isIntersecting,
  };
}

// Hook for lazy loading data
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  options?: UseLazyLoadingOptions & { 
    dependencies?: any[];
    cacheKey?: string;
  }
) {
  const { dependencies = [], cacheKey, ...lazyOptions } = options || {};
  const { ref, isIntersecting } = useLazyLoading(lazyOptions);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isIntersecting && !data && !isLoading) {
      setIsLoading(true);
      const startTime = performance.now();
      
      fetchFn()
        .then((result) => {
          setData(result);
          setIsLoading(false);
          
          // Track data loading time
          const loadTime = performance.now() - startTime;
          performanceMonitor.startTiming('DATA_LAZY_LOAD')();
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isIntersecting, data, isLoading, fetchFn, ...dependencies]);

  return {
    ref,
    data,
    isLoading,
    error,
    isIntersecting,
  };
}