'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/format';
import {
  generateSrcSet,
  generateSizes,
  getOptimizedImageUrl,
  createBlurPlaceholder,
  IMAGE_SIZES,
  type ImageOptimizationOptions,
} from '@/utils/imageOptimization';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  size?: keyof typeof IMAGE_SIZES;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  aspectRatio?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export default function ResponsiveImage({
  src,
  alt,
  size,
  width,
  height,
  className,
  priority = false,
  fill = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  sizes,
  aspectRatio,
  objectFit = 'cover',
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check if it's an SVG
  const isSVG = src.endsWith('.svg');

  // Get dimensions from size preset or use provided width/height
  const dimensions = size ? IMAGE_SIZES[size] : { width, height };
  const finalWidth = dimensions.width || width || 400;
  const finalHeight = dimensions.height || height || 400;

  // Calculate aspect ratio
  const calculatedAspectRatio = aspectRatio || 
    (finalWidth && finalHeight ? finalWidth / finalHeight : 1);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // For SVGs, use original src without optimization
  const optimizedSrc = isSVG ? src : getOptimizedImageUrl(src, {
    width: finalWidth,
    height: finalHeight,
    quality,
    format: 'webp',
  });

  // Generate responsive sizes
  const responsiveSizes = sizes || generateSizes({
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1280px)': '33vw',
  });

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400 border border-gray-200',
          className
        )}
        style={
          !fill && finalWidth && finalHeight
            ? { 
                width: finalWidth, 
                height: finalHeight,
                aspectRatio: calculatedAspectRatio,
              }
            : { aspectRatio: calculatedAspectRatio }
        }
      >
        <svg
          className="w-8 h-8"
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
    );
  }

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={
        !fill && calculatedAspectRatio
          ? { aspectRatio: calculatedAspectRatio }
          : undefined
      }
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: calculatedAspectRatio }}
        />
      )}
      
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : finalWidth}
        height={fill ? undefined : finalHeight}
        fill={fill}
        sizes={fill ? responsiveSizes : undefined}
        quality={isSVG ? undefined : quality}
        priority={priority}
        placeholder={isSVG ? 'empty' : placeholder}
        blurDataURL={!isSVG && placeholder === 'blur' ? (blurDataURL || createBlurPlaceholder(src)) : undefined}
        className={cn(
          'transition-all duration-300',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        )}
        style={{
          objectFit,
        }}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={isSVG}
      />
    </div>
  );
}