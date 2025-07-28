'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactElement } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

// Admin components - heavy and not needed on initial load
// AdminLayout temporarily disabled until component is created

// Admin pages temporarily disabled until created

// Payment components - only load when needed
// Temporarily disabled until components are created

// Modal components - load on demand
// Temporarily disabled until components are created

// Product components that can be lazy loaded
// Temporarily disabled until components are created

// Utility function to create dynamic component with custom loading
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: () => ReactElement;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading || (() => <LoadingSpinner />),
    ssr: options.ssr ?? true,
  });
}

// Lazy load heavy third-party libraries
export const lazyLoadLibrary = async (libraryName: string) => {
  // Temporarily disabled until libraries are installed
  throw new Error(`Library loading disabled: ${libraryName}`);
};