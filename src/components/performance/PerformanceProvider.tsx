'use client';

import { useEffect, ReactNode } from 'react';
import { performanceMonitor } from '@/utils/performance';
import { serviceWorkerManager } from '@/utils/serviceWorker';
import { cacheManager } from '@/utils/caching';

interface PerformanceProviderProps {
  children: ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Initialize performance monitoring
    const initializePerformance = async () => {
      try {
        // Register service worker
        await serviceWorkerManager.register();
        
        // Request notification permission for PWA
        await serviceWorkerManager.requestNotificationPermission();
        
        // Log initial performance metrics
        setTimeout(() => {
          const metrics = performanceMonitor.getAllMetrics();
          console.log('Performance Metrics:', metrics);
          
          // Get recommendations
          const recommendations = performanceMonitor.getRecommendations();
          if (recommendations.length > 0) {
            console.warn('Performance Recommendations:', recommendations);
          }
        }, 5000);
        
        // Monitor memory usage
        const checkMemory = () => {
          const memoryInfo = performanceMonitor.getMemoryInfo();
          if (memoryInfo && memoryInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
            console.warn('High memory usage detected:', memoryInfo);
            // Clear some caches if memory is high
            cacheManager.clear('memory');
          }
        };
        
        // Check memory every 30 seconds
        const memoryInterval = setInterval(checkMemory, 30000);
        
        // Monitor connection changes
        const handleConnectionChange = () => {
          const connection = performanceMonitor.getConnectionInfo();
          if (connection) {
            console.log('Connection changed:', {
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt,
            });
            
            // Adjust cache strategies based on connection
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
              // Aggressive caching for slow connections
              console.log('Slow connection detected, enabling aggressive caching');
            }
          }
        };
        
        if ('connection' in navigator) {
          (navigator as any).connection?.addEventListener('change', handleConnectionChange);
        }
        
        // Cleanup function
        return () => {
          clearInterval(memoryInterval);
          if ('connection' in navigator) {
            (navigator as any).connection?.removeEventListener('change', handleConnectionChange);
          }
        };
      } catch (error) {
        console.error('Failed to initialize performance monitoring:', error);
      }
    };
    
    initializePerformance();
  }, []);

  // Monitor page visibility for performance optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause non-critical operations
        console.log('Page hidden, pausing non-critical operations');
      } else {
        // Page is visible, resume operations
        console.log('Page visible, resuming operations');
        
        // Update service worker if needed
        serviceWorkerManager.update();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online');
      // Sync any pending data
      serviceWorkerManager.syncCart();
      serviceWorkerManager.syncOrders();
    };
    
    const handleOffline = () => {
      console.log('App is offline');
      // Show offline notification
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <>{children}</>;
}