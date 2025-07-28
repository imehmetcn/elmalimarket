'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { formatPrice } from '@/utils/format';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/utils/orderNumber';
import Container from '@/components/ui/Container';
import TouchButton from '@/components/ui/TouchButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error('Sipariş bulunamadı');
        }
        const data = await response.json();
        setOrder(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  // 3 saniye countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Sipariş bilgileri yükleniyor...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <TouchButton variant="primary">Ana Sayfaya Dön</TouchButton>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
          <p className="text-lg text-gray-600">
            Sipariş numaranız: <span className="font-semibold text-primary-600">#{order.id}</span>
          </p>
          {countdown > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Sipariş detaylarına {countdown} saniye içinde yönlendirileceksiniz...
            </p>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sipariş Özeti</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
                    <p className="text-sm text-gray-500">
                      {item.quantity} adet × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                <span>Toplam Tutar:</span>
                <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {order.shippingAddress && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teslimat Bilgileri</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600 mt-2">
                  {order.shippingAddress.address}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.district}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Sırada Ne Var?</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Siparişiniz onaylandı ve işleme alındı</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>E-posta ile sipariş detayları gönderildi</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span>Siparişiniz hazırlanıp kargoya verilecek</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
              <span>Kargo takip bilgileri SMS ile gönderilecek</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/orders/${order.id}`}>
            <TouchButton variant="primary" size="lg" fullWidth className="sm:w-auto">
              Sipariş Detaylarını Görüntüle
            </TouchButton>
          </Link>
          <Link href="/products">
            <TouchButton variant="outline" size="lg" fullWidth className="sm:w-auto">
              Alışverişe Devam Et
            </TouchButton>
          </Link>
        </div>

        {/* Auto redirect */}
        {countdown === 0 && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                setTimeout(() => {
                  window.location.href = '/orders/${order.id}';
                }, 100);
              `,
            }}
          />
        )}
      </div>
    </Container>
  );
}