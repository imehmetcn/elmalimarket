// Uygulama sabitleri
export const APP_CONFIG = {
  name: 'Elmalı Market',
  description: 'Elmalı Market - Online Alışveriş',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  version: '1.0.0',
};

// API sabitleri
export const API_ROUTES = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  PRODUCT_SEARCH: '/api/products/search',
  
  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,
  
  // Cart
  CART: '/api/cart',
  CART_ADD: '/api/cart/add',
  CART_UPDATE: '/api/cart/update',
  CART_REMOVE: '/api/cart/remove',
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,
  
  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_USERS: '/api/admin/users',
};

// Sayfa rotaları
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CATEGORIES: '/categories',
  CATEGORY_PRODUCTS: (id: string) => `/categories/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
};

// Sipariş durumları
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Beklemede',
  [ORDER_STATUS.CONFIRMED]: 'Onaylandı',
  [ORDER_STATUS.PREPARING]: 'Hazırlanıyor',
  [ORDER_STATUS.SHIPPED]: 'Kargoda',
  [ORDER_STATUS.DELIVERED]: 'Teslim Edildi',
  [ORDER_STATUS.CANCELLED]: 'İptal Edildi',
};

// Ödeme durumları
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Beklemede',
  [PAYMENT_STATUS.PAID]: 'Ödendi',
  [PAYMENT_STATUS.FAILED]: 'Başarısız',
};

// Kullanıcı rolleri
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

// Sayfalama sabitleri
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Dosya yükleme sabitleri
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  UPLOAD_DIR: '/uploads',
};

// Validasyon sabitleri
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 11,
  POSTAL_CODE_LENGTH: 5,
  MAX_CART_QUANTITY: 99,
};

// Cache süreleri (saniye)
export const CACHE_DURATION = {
  PRODUCTS: 300, // 5 dakika
  CATEGORIES: 600, // 10 dakika
  USER_SESSION: 3600, // 1 saat
};