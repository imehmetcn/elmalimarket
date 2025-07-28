'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/utils/format';
import { formatPrice } from '@/utils/format';
import LazyImage from '@/components/ui/LazyImage';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
  onQuickAdd?: (productId: string) => void;
  priority?: boolean;
}

export default function ProductCard({
  product,
  className,
  showQuickAdd = true,
  onQuickAdd,
  priority = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onQuickAdd || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onQuickAdd(product.id);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const finalPrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock <= 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className={cn(
          'group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300',
          'hover:shadow-lg hover:border-gray-300',
          isOutOfStock && 'opacity-75',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50">
          <LazyImage
            src={product.images[0] || '/images/placeholder-product.svg'}
            alt={product.name}
            fill
            priority={priority}
            quality={80}
            className="transition-transform duration-300 group-hover:scale-105"
            objectFit="cover"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                %{discountPercentage} İndirim
              </span>
            )}
            {isOutOfStock && (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded">
                Stokta Yok
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                Son {product.stock} Adet
              </span>
            )}
          </div>

          {/* Quick Add Button - Touch friendly */}
          {showQuickAdd && !isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isAddingToCart}
              className={cn(
                'absolute bottom-2 right-2 p-3 bg-primary-500 text-white rounded-full shadow-lg transition-all duration-300',
                'hover:bg-primary-600 hover:scale-110 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-primary-300',
                'touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center',
                'md:p-2 md:min-w-[36px] md:min-h-[36px]', // Smaller on desktop
                'md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0', // Hide on desktop until hover
                'opacity-100 translate-y-0', // Always visible on mobile
                isAddingToCart && 'animate-pulse'
              )}
              aria-label="Sepete Ekle"
            >
              {isAddingToCart ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Wishlist Button - Touch friendly */}
          <button
            className={cn(
              'absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-gray-600 rounded-full shadow-md transition-all duration-300',
              'hover:bg-white hover:text-red-500 hover:scale-110 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-red-300',
              'touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center',
              'md:opacity-0 md:group-hover:opacity-100', // Hide on desktop until hover
              'opacity-80' // Semi-visible on mobile
            )}
            aria-label="Favorilere Ekle"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(finalPrice)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < 4 ? 'text-yellow-400' : 'text-gray-300'
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">(24)</span>
          </div>

          {/* Social Proof */}
          <div className="text-xs text-gray-500">
            Son 24 saatte 12 kişi satın aldı
          </div>
        </div>
      </div>
    </Link>
  );
}