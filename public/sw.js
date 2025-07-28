const CACHE_NAME = 'elmali-market-v1';
const STATIC_CACHE_NAME = 'elmali-market-static-v1';
const DYNAMIC_CACHE_NAME = 'elmali-market-dynamic-v1';
const IMAGE_CACHE_NAME = 'elmali-market-images-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  // Add critical CSS and JS files here
];

// API routes to cache
const API_CACHE_PATTERNS = [
  /^\/api\/products/,
  /^\/api\/categories/,
  /^\/api\/search/,
];

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  /^https:\/\/images\.unsplash\.com/,
  /^https:\/\/via\.placeholder\.com/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with different strategies
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Check if request is for API
function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Check if request is for static asset
function isStaticAsset(request) {
  return request.destination === 'script' || 
         request.destination === 'style' ||
         request.destination === 'font' ||
         request.url.includes('/_next/static/');
}

// Handle image requests - Cache First strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Error handling image request', error);
    // Return a fallback image if available
    return caches.match('/images/placeholder.png') || new Response('', { status: 404 });
  }
}

// Handle API requests - Network First with fallback
async function handleAPIRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (networkError) {
      console.log('Service Worker: Network failed, trying cache for API request');
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      throw networkError;
    }
  } catch (error) {
    console.error('Service Worker: Error handling API request', error);
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Error handling static asset', error);
    throw error;
  }
}

// Handle page requests - Network First with offline fallback
async function handlePageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (networkError) {
      console.log('Service Worker: Network failed, trying cache for page request');
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline page if available
      return caches.match('/offline') || new Response('Offline', { status: 503 });
    }
  } catch (error) {
    console.error('Service Worker: Error handling page request', error);
    return new Response('Service Worker Error', { status: 500 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'order-sync') {
    event.waitUntil(syncOrders());
  }
});

// Sync cart data when back online
async function syncCart() {
  try {
    // Get pending cart actions from IndexedDB
    const pendingActions = await getPendingCartActions();
    
    for (const action of pendingActions) {
      try {
        await fetch('/api/cart', {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
        // Remove from pending actions
        await removePendingCartAction(action.id);
      } catch (error) {
        console.error('Service Worker: Failed to sync cart action', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing cart', error);
  }
}

// Sync order data when back online
async function syncOrders() {
  try {
    // Implementation for syncing orders
    console.log('Service Worker: Syncing orders...');
  } catch (error) {
    console.error('Service Worker: Error syncing orders', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingCartActions() {
  // Implementation would use IndexedDB to get pending actions
  return [];
}

async function removePendingCartAction(id) {
  // Implementation would use IndexedDB to remove action
  console.log('Removing pending cart action:', id);
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Elmalı Market\'ten yeni bir bildirim',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Elmalı Market', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});