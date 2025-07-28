'use client';

import { cn } from '@/utils/format';

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
  rounded?: boolean;
}

export default function ImageSkeleton({
  className,
  aspectRatio = 1,
  width,
  height,
  rounded = false,
}: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 animate-pulse',
        rounded && 'rounded-lg',
        className
      )}
      style={{
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}

// Product card skeleton
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      <ImageSkeleton aspectRatio={1} className="w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8 ml-2" />
        </div>
      </div>
    </div>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}