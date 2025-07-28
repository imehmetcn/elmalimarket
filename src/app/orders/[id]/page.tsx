'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import { generateOrderTimeline } from '@/utils/orderUtils';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Sipariş bulunamadı');
      }

      const data = await response.json();
      setOrder(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sipariş Bulunamadı
          </h1>
          <p className="text-gray-600 mb-8">
            {error || 'Aradığınız sipariş bulunamadı.'}
          </p>
          <Link
            href="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const timeline = generateOrderTimeline(order);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sipariş Takibi
              </h1>
              <p className="text-gray-600">
                Sipariş No: <span className="font-semibold text-primary-600">#{order.id}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Sipariş Tarihi</div>
              <div className="font-medium">{formatDate(order.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">Sipariş Durumu</h2>
                
                <div className="relative">
                  {timeline.map((step, index) => (
                    <div key={step.status} className="flex items-start mb-8 last:mb-0">
                      {/* Timeline line */}
                      {index < timeline.length - 1 && (
                        <div className={`absolute left-4 top-8 w-0.5 h-16 ${
                          step.completed ? 'bg-primary-600' : 'bg-gray-300'
                        }`} />
                      )}
                      
                      {/* Timeline dot */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-current rounded-full" />
                        )}
                      </div>
                      
                      {/* Timeline content */}
                      <div className="ml-4 flex-1">
                        <div className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-sm mt-1 ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </div>
                        {step.completed && step.date && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(step.date)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <div>
                        <div className="font-medium text-blue-900">Kargo Takip Numarası</div>
                        <div className="text-blue-700 font-mono">{order.trackingNumber}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Sipariş Detayları</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <ResponsiveImage
                          src={item.product.images[0] || '/images/placeholder-product.svg'}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          Adet: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="text-gray-900">
                      {formatPrice(order.items.reduce((sum, item) => sum + item.totalPrice, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className="text-green-600">Ücretsiz</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Toplam</span>
                    <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Order Status */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Durum</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'PREPARING' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'PENDING' && 'Beklemede'}
                    {order.status === 'CONFIRMED' && 'Onaylandı'}
                    {order.status === 'PREPARING' && 'Hazırlanıyor'}
                    {order.status === 'SHIPPED' && 'Kargoda'}
                    {order.status === 'DELIVERED' && 'Teslim Edildi'}
                    {order.status === 'CANCELLED' && 'İptal Edildi'}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">Ödeme</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus === 'PENDING' && 'Beklemede'}
                    {order.paymentStatus === 'PAID' && 'Ödendi'}
                    {order.paymentStatus === 'FAILED' && 'Başarısız'}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {order.status === 'PENDING' && (
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                      Siparişi İptal Et
                    </button>
                  )}
                  
                  <Link
                    href="/products"
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block text-sm"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Teslimat Adresi</h2>
                <div className="text-gray-700 text-sm">
                  <div className="font-medium">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </div>
                  <div className="mt-1">{order.shippingAddress?.phone}</div>
                  <div className="mt-1">{order.shippingAddress?.address}</div>
                  <div className="mt-1">
                    {order.shippingAddress?.district}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}