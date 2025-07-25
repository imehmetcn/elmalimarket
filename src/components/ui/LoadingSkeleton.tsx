interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined)
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <LoadingSkeleton className="aspect-square" />
      <div className="p-3 space-y-3">
        <LoadingSkeleton variant="text" lines={2} />
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="circular" width={12} height={12} />
          ))}
        </div>
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton height={36} />
      </div>
    </div>
  );
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
      <LoadingSkeleton variant="circular" width={40} height={40} className="mx-auto mb-3" />
      <LoadingSkeleton variant="text" width="80%" className="mx-auto" />
    </div>
  );
}