'use client';

// Cache configuration
export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

// Default cache configurations for different data types
export const CACHE_CONFIGS = {
  products: { ttl: 5 * 60 * 1000, maxSize: 100, storage: 'localStorage' as const }, // 5 minutes
  categories: { ttl: 30 * 60 * 1000, maxSize: 50, storage: 'localStorage' as const }, // 30 minutes
  user: { ttl: 15 * 60 * 1000, maxSize: 1, storage: 'sessionStorage' as const }, // 15 minutes
  cart: { ttl: 60 * 60 * 1000, maxSize: 1, storage: 'localStorage' as const }, // 1 hour
  search: { ttl: 10 * 60 * 1000, maxSize: 20, storage: 'memory' as const }, // 10 minutes
  api: { ttl: 2 * 60 * 1000, maxSize: 50, storage: 'memory' as const }, // 2 minutes
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Memory cache for runtime data
class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Storage cache for persistent data
class StorageCache {
  private storage: Storage;
  private prefix: string;
  private maxSize: number;

  constructor(storage: Storage, prefix: string = 'elmali_cache_', maxSize: number = 100) {
    this.storage = storage;
    this.prefix = prefix;
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl: number): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      const fullKey = this.prefix + key;
      this.storage.setItem(fullKey, JSON.stringify(item));

      // Clean up old items if needed
      this.cleanup();
    } catch (error) {
      console.warn('Failed to set cache item:', error);
      // Storage might be full, try to clear some space
      this.cleanup(true);
    }
  }

  get<T>(key: string): T | null {
    try {
      const fullKey = this.prefix + key;
      const itemStr = this.storage.getItem(fullKey);
      
      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);

      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.storage.removeItem(fullKey);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      return null;
    }
  }

  delete(key: string): boolean {
    try {
      const fullKey = this.prefix + key;
      this.storage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.warn('Failed to delete cache item:', error);
      return false;
    }
  }

  clear(): void {
    try {
      const keys = this.keys();
      keys.forEach(key => this.storage.removeItem(this.prefix + key));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  keys(): string[] {
    const keys: string[] = [];
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
    } catch (error) {
      console.warn('Failed to get cache keys:', error);
    }
    return keys;
  }

  private cleanup(aggressive: boolean = false): void {
    try {
      const keys = this.keys();
      const items: Array<{ key: string; timestamp: number }> = [];

      // Collect all items with timestamps
      keys.forEach(key => {
        try {
          const itemStr = this.storage.getItem(this.prefix + key);
          if (itemStr) {
            const item = JSON.parse(itemStr);
            items.push({ key, timestamp: item.timestamp });
          }
        } catch (error) {
          // Remove corrupted items
          this.storage.removeItem(this.prefix + key);
        }
      });

      // Sort by timestamp (oldest first)
      items.sort((a, b) => a.timestamp - b.timestamp);

      // Remove expired items
      const now = Date.now();
      items.forEach(({ key }) => {
        const item = this.get(key);
        if (!item) {
          // Item was expired and removed by get()
          return;
        }
      });

      // If still over limit or aggressive cleanup, remove oldest items
      const currentSize = this.keys().length;
      const targetSize = aggressive ? Math.floor(this.maxSize * 0.7) : this.maxSize;
      
      if (currentSize > targetSize) {
        const itemsToRemove = currentSize - targetSize;
        for (let i = 0; i < itemsToRemove && i < items.length; i++) {
          this.delete(items[i].key);
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }
}

// Main cache manager
export class CacheManager {
  private memoryCache: MemoryCache;
  private localStorageCache: StorageCache;
  private sessionStorageCache: StorageCache;

  constructor() {
    this.memoryCache = new MemoryCache();
    
    if (typeof window !== 'undefined') {
      this.localStorageCache = new StorageCache(localStorage);
      this.sessionStorageCache = new StorageCache(sessionStorage);
    } else {
      // Fallback for SSR
      this.localStorageCache = this.memoryCache as any;
      this.sessionStorageCache = this.memoryCache as any;
    }
  }

  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const { ttl = 5 * 60 * 1000, storage = 'memory' } = config;

    switch (storage) {
      case 'localStorage':
        this.localStorageCache.set(key, data, ttl);
        break;
      case 'sessionStorage':
        this.sessionStorageCache.set(key, data, ttl);
        break;
      default:
        this.memoryCache.set(key, data, ttl);
    }
  }

  get<T>(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): T | null {
    switch (storage) {
      case 'localStorage':
        return this.localStorageCache.get<T>(key);
      case 'sessionStorage':
        return this.sessionStorageCache.get<T>(key);
      default:
        return this.memoryCache.get<T>(key);
    }
  }

  delete(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): boolean {
    switch (storage) {
      case 'localStorage':
        return this.localStorageCache.delete(key);
      case 'sessionStorage':
        return this.sessionStorageCache.delete(key);
      default:
        return this.memoryCache.delete(key);
    }
  }

  clear(storage?: 'memory' | 'localStorage' | 'sessionStorage'): void {
    if (!storage) {
      this.memoryCache.clear();
      this.localStorageCache.clear();
      this.sessionStorageCache.clear();
    } else {
      switch (storage) {
        case 'localStorage':
          this.localStorageCache.clear();
          break;
        case 'sessionStorage':
          this.sessionStorageCache.clear();
          break;
        default:
          this.memoryCache.clear();
      }
    }
  }

  // Convenience methods for specific data types
  setProducts(key: string, data: any): void {
    this.set(key, data, CACHE_CONFIGS.products);
  }

  getProducts<T>(key: string): T | null {
    return this.get<T>(key, CACHE_CONFIGS.products.storage);
  }

  setCategories(key: string, data: any): void {
    this.set(key, data, CACHE_CONFIGS.categories);
  }

  getCategories<T>(key: string): T | null {
    return this.get<T>(key, CACHE_CONFIGS.categories.storage);
  }

  setUser(key: string, data: any): void {
    this.set(key, data, CACHE_CONFIGS.user);
  }

  getUser<T>(key: string): T | null {
    return this.get<T>(key, CACHE_CONFIGS.user.storage);
  }

  setCart(key: string, data: any): void {
    this.set(key, data, CACHE_CONFIGS.cart);
  }

  getCart<T>(key: string): T | null {
    return this.get<T>(key, CACHE_CONFIGS.cart.storage);
  }

  setSearch(key: string, data: any): void {
    this.set(key, data, CACHE_CONFIGS.search);
  }

  getSearch<T>(key: string): T | null {
    return this.get<T>(key, CACHE_CONFIGS.search.storage);
  }

  setAPI(key: string, data: any): void {
    this.set(key, data, CACHE_CONFIGS.api);
  }

  getAPI<T>(key: string): T | null {
    return this.get<T>(key, CACHE_CONFIGS.api.storage);
  }

  // Cache statistics
  getStats() {
    return {
      memory: {
        size: this.memoryCache.size(),
        keys: this.memoryCache.keys(),
      },
      localStorage: {
        keys: this.localStorageCache.keys(),
      },
      sessionStorage: {
        keys: this.sessionStorageCache.keys(),
      },
    };
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Utility function to create cache keys
export function createCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${prefix}:${sortedParams}`;
}

// HOC for caching API responses
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  config: CacheConfig = {}
): T {
  return (async (...args: any[]) => {
    const key = typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;
    
    // Try to get from cache first
    const cached = cacheManager.get(key, config.storage);
    if (cached) {
      return cached;
    }

    // Execute function and cache result
    try {
      const result = await fn(...args);
      cacheManager.set(key, result, config);
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }) as T;
}