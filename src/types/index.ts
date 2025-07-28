// Kullanıcı tipleri (Prisma ile uyumlu)
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

// Adres tipi
export interface Address {
  id: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

// Kategori tipi (Prisma ile uyumlu)
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Ürün tipi (Prisma ile uyumlu)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  categoryId: string;
  category?: Category;
  images: string[]; // Frontend'de string array olarak kullanacağız
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sepet öğesi tipi
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

// Sepet tipi (Prisma ile uyumlu)
export interface Cart {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Sipariş öğesi tipi
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

// Sipariş tipi (Prisma ile uyumlu)
export interface Order {
  id: string;
  orderNumber?: string | null;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddressId: string;
  shippingAddress?: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  trackingNumber?: string | null;
  estimatedDelivery?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination tipi
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

// Auth tipleri
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
}

// Search ve Filter tipleri
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt';
  direction: 'asc' | 'desc';
}