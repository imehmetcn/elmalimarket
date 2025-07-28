'use client';

import { CartItem } from '@/types';
import { formatPrice } from '@/utils/format';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  isLoading?: boolean;
}

export default function OrderSummary({
  items,
  total,
  isLoading = false,
}: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 200 ? 0 : 15; // Free shipping over 200 TL
  const finalTotal = subtotal + shippingCost;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Sipariş Özeti</h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <ResponsiveImage
                src={item.product.images[0] || '/images/placeholder-product.svg'}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
              {/* Quantity badge */}
              <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600">
                  {item.quantity} × {formatPrice(item.price)}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Kupon kodu"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Uygula
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Ara Toplam</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Kargo</span>
          <span className={`${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
          </span>
        </div>

        {/* Free shipping progress */}
        {shippingCost > 0 && (
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-800 mb-2">
              {formatPrice(200 - subtotal)} daha alışveriş yapın, kargo bedava!
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <hr className="border-gray-200" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900">Toplam</span>
          <span className="text-primary-600">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* Security Badges */}
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          SSL ile güvenli ödeme
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          30 gün iade garantisi
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Hızlı teslimat
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-sm text-gray-600">İşleniyor...</span>
          </div>
        </div>
      )}
    </div>
  );
}