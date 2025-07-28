'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/format';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import LazyImage from '@/components/ui/LazyImage';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      // Swipe left - next image
      setSelectedIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }

    if (isRightSwipe && images.length > 1) {
      // Swipe right - previous image
      setSelectedIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    }

    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setSelectedIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={cn('aspect-square bg-gray-100 rounded-lg', className)}>
        <div className="flex items-center justify-center h-full text-gray-400">
          <svg
            className="w-16 h-16"
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

  const selectedImage = images[selectedIndex];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div 
        ref={imageRef}
        className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ResponsiveImage
          src={selectedImage}
          alt={`${productName} - Görsel ${selectedIndex + 1}`}
          fill
          priority={selectedIndex === 0}
          quality={90}
          className={cn(
            'cursor-zoom-in transition-transform duration-300 select-none',
            isZoomed ? 'scale-150' : 'scale-100'
          )}
          objectFit="contain"
          onClick={() => setIsZoomed(!isZoomed)}
          draggable={false}
        />
        
        {/* Zoom indicator */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isZoomed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-3m-3 0h3m0 0V7m0 3v3"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            )}
          </svg>
        </button>

        {/* Navigation arrows for multiple images - Hidden on mobile, shown on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex(prev => 
                prev === 0 ? images.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors hidden md:flex items-center justify-center touch-manipulation"
              aria-label="Önceki görsel"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            
            <button
              onClick={() => setSelectedIndex(prev => 
                prev === images.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors hidden md:flex items-center justify-center touch-manipulation"
              aria-label="Sonraki görsel"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Swipe indicator for mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/80 text-xs bg-black/40 px-2 py-1 rounded-full md:hidden">
            Kaydırın
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <LazyImage
                src={image}
                alt={`${productName} - Küçük görsel ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full"
                objectFit="cover"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}