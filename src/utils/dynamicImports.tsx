'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

// Admin components - heavy and not needed on initial load
export const AdminLayout = dynamic(() => import('@/components/admin/AdminLayout'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const AdminDashboard = dynamic(() => import('@/app/admin/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const ProductManagement = dynamic(() => import('@/app/admin/products/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const OrderManagement = dynamic(() => import('@/app/admin/orders/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Payment components - only load when needed
export const PaymentProcessor = dynamic(() => import('@/components/payment/PaymentProcessor'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const CheckoutForm = dynamic(() => import('@/components/checkout/CheckoutForm'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Modal components - load on demand
export const OrderDetailModal = dynamic(() => import('@/components/admin/OrderDetailModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const DeleteConfirmModal = dynamic(() => import('@/components/admin/DeleteConfirmModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const BulkActionModal = dynamic(() => import('@/components/admin/BulkActionModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Product components that can be lazy loaded
export const ProductFilters = dynamic(() => import('@/components/product/ProductFilters'), {
  loading: () => <LoadingSpinner />,
  ssr: true, // Keep SSR for SEO
});

export const ProductImageGallery = dynamic(() => import('@/components/product/ProductImageGallery'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

// Search components
export const SearchBox = dynamic(() => import('@/components/ui/SearchBox'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

// Cart drawer - mobile specific
export const MobileCartDrawer = dynamic(() => import('@/components/cart/MobileCartDrawer'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Mobile menu
export const MobileMenu = dynamic(() => import('@/components/layout/MobileMenu'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Utility function to create dynamic component with custom loading
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading || LoadingSpinner,
    ssr: options.ssr ?? true,
  });
}

// Lazy load heavy third-party libraries
export const lazyLoadLibrary = async (libraryName: string) => {
  switch (libraryName) {
    case 'chart':
      return import('chart.js').then(module => module.default);
    case 'date-fns':
      return import('date-fns');
    case 'lodash':
      return import('lodash');
    default:
      throw new Error(`Unknown library: ${libraryName}`);
  }
};