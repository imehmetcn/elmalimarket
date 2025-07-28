'use client';

import { useLazyImage } from '@/hooks/useLazyLoading';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/utils/format';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
}: LazyImageProps) {
  const {
    ref,
    src: lazySrc,
    isLoaded,
    onLoad: handleLazyLoad,
  } = useLazyImage(src, { threshold, rootMargin });

  const handleLoad = () => {
    handleLazyLoad();
    onLoad?.();
  };

  // If priority is true, don't use lazy loading
  if (priority) {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        fill={fill}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={onError}
      />
    );
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {lazySrc ? (
        <OptimizedImage
          src={lazySrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          fill={fill}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={onError}
        />
      ) : (
        // Placeholder while waiting for intersection
        <div
          className={cn(
            'bg-gray-200 animate-pulse',
            fill ? 'absolute inset-0' : '',
            !fill && width && height ? `w-[${width}px] h-[${height}px]` : ''
          )}
          style={
            !fill && width && height
              ? { width: `${width}px`, height: `${height}px` }
              : undefined
          }
        />
      )}
    </div>
  );
}