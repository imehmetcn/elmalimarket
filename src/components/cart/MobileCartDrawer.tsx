'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/format';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCartDrawer({ isOpen, onClose }: MobileCartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Cart Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Sepetim ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="text-gray-500 mb-4">Sepetiniz boş</p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors touch-manipulation"
                >
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex-shrink-0 w-16 h-16">
                      <OptimizedImage
                        src={item.product.images[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-semibold">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 touch-manipulation"
                          disabled={item.quantity <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-12 h-8 flex items-center justify-center bg-white border-t border-b border-gray-300 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 touch-manipulation"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 touch-manipulation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Toplam:</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              {/* Free Shipping Progress */}
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Ücretsiz Kargo</span>
                  <span className="text-primary-600 font-medium">150 TL</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((getTotalPrice() / 150) * 100, 100)}%` }}
                  ></div>
                </div>
                {getTotalPrice() < 150 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPrice(150 - getTotalPrice())} daha alışveriş yapın, kargo bedava!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium text-center block hover:bg-gray-200 transition-colors touch-manipulation"
                >
                  Sepeti Görüntüle
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium text-center block hover:bg-primary-700 transition-colors touch-manipulation"
                >
                  Hızlı Ödeme
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}