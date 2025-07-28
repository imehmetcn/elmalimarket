'use client';

import { useState, useEffect } from 'react';
import { performanceMonitor, BundleAnalyzer } from '@/utils/performance';
import { cacheManager } from '@/utils/caching';
import { serviceWorkerManager } from '@/utils/serviceWorker';

interface PerformanceMetric {
  name: string;
  avg: number;
  p95: number;
  count: number;
  status: 'good' | 'needs-improvement' | 'poor';
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      const rawMetrics = performanceMonitor.getAllMetrics();
      const formattedMetrics: PerformanceMetric[] = Object.entries(rawMetrics).map(([name, data]) => ({
        name,
        avg: data.avg,
        p95: data.p95,
        count: data.count,
        status: getMetricStatus(name, data.avg),
      }));

      setMetrics(formattedMetrics);
      setCacheStats(cacheManager.getStats());
      setRecommendations(performanceMonitor.getRecommendations());
    };

    // Update metrics every 5 seconds when visible
    let interval: NodeJS.Timeout;
    if (isVisible) {
      updateMetrics();
      interval = setInterval(updateMetrics, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  const getMetricStatus = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
      DOM_LOAD: { good: 1500, poor: 3000 },
      WINDOW_LOAD: { good: 3000, poor: 5000 },
    };

    const threshold = thresholds[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const clearAllCaches = async () => {
    cacheManager.clear();
    await serviceWorkerManager.clearCache();
    alert('Tüm önbellekler temizlendi');
  };

  const analyzeBundle = () => {
    BundleAnalyzer.analyzeChunks();
    const unusedCSS = BundleAnalyzer.getUnusedCSS();
    console.log('Unused CSS rules:', unusedCSS.slice(0, 10)); // Show first 10
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performans Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Performans Dashboard</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Core Web Vitals */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.filter(m => ['LCP', 'FID', 'CLS'].includes(m.name)).map((metric) => (
                <div key={metric.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{metric.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metric.name === 'CLS' ? metric.avg.toFixed(3) : `${Math.round(metric.avg)}ms`}
                  </div>
                  <div className="text-sm text-gray-600">
                    P95: {metric.name === 'CLS' ? metric.p95.toFixed(3) : `${Math.round(metric.p95)}ms`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Metrics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Diğer Metrikler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.filter(m => !['LCP', 'FID', 'CLS'].includes(m.name)).map((metric) => (
                <div key={metric.name} className="border rounded-lg p-3">
                  <div className="font-medium text-sm">{metric.name}</div>
                  <div className="text-lg font-bold">{Math.round(metric.avg)}ms</div>
                  <div className="text-xs text-gray-600">{metric.count} ölçüm</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cache Stats */}
          {cacheStats && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Önbellek İstatistikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="font-medium">Memory Cache</div>
                  <div className="text-lg font-bold">{cacheStats.memory.size} öğe</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-medium">Local Storage</div>
                  <div className="text-lg font-bold">{cacheStats.localStorage.keys.length} öğe</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-medium">Session Storage</div>
                  <div className="text-lg font-bold">{cacheStats.sessionStorage.keys.length} öğe</div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Öneriler</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">⚠️</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={clearAllCaches}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Önbellekleri Temizle
            </button>
            <button
              onClick={analyzeBundle}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Bundle Analizi (Console)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to conditionally show performance dashboard in development
export function usePerformanceDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show dashboard with Ctrl+Shift+P
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowDashboard(true);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  return { showDashboard, setShowDashboard };
}