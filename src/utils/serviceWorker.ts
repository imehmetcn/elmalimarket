'use client';

// Service Worker registration and management
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
  }

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              this.notifyUpdate();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleMessage);

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  async update(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      await this.registration.update();
      console.log('Service Worker update check completed');
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  private handleMessage = (event: MessageEvent) => {
    console.log('Message from Service Worker:', event.data);
    
    switch (event.data.type) {
      case 'CACHE_UPDATED':
        this.notifyUpdate();
        break;
      case 'OFFLINE':
        this.notifyOffline();
        break;
      case 'ONLINE':
        this.notifyOnline();
        break;
    }
  };

  private notifyUpdate(): void {
    // Show update notification to user
    if (window.confirm('Yeni bir sürüm mevcut. Sayfayı yenilemek ister misiniz?')) {
      window.location.reload();
    }
  }

  private notifyOffline(): void {
    // Show offline notification
    console.log('App is now offline');
    this.showToast('İnternet bağlantısı kesildi. Çevrimdışı modda çalışıyorsunuz.', 'warning');
  }

  private notifyOnline(): void {
    // Show online notification
    console.log('App is now online');
    this.showToast('İnternet bağlantısı yeniden kuruldu.', 'success');
  }

  private showToast(message: string, type: 'success' | 'warning' | 'error'): void {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-sm ${
      type === 'success' ? 'bg-green-500' : 
      type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  // Background sync methods
  async syncCart(): Promise<void> {
    if (!this.registration || !(this.registration as any).sync) {
      console.log('Background sync not supported');
      return;
    }

    try {
      await (this.registration as any).sync.register('cart-sync');
      console.log('Cart sync registered');
    } catch (error) {
      console.error('Cart sync registration failed:', error);
    }
  }

  async syncOrders(): Promise<void> {
    if (!this.registration || !(this.registration as any).sync) {
      console.log('Background sync not supported');
      return;
    }

    try {
      await (this.registration as any).sync.register('order-sync');
      console.log('Order sync registered');
    } catch (error) {
      console.error('Order sync registration failed:', error);
    }
  }

  // Push notification methods
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.log('Service Worker not registered');
      return null;
    }

    const permission = await this.requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      console.log('Push subscription created:', subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  // Cache management
  async clearCache(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    if (!('caches' in window) || !('storage' in navigator) || !('estimate' in navigator.storage)) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();

// Auto-register service worker on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    serviceWorkerManager.register();
  });
}