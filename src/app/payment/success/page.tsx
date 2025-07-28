'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    // Redirect countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (orderId) {
            router.push(`/orders/${orderId}`);
          } else {
            router.push('/');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ödeme Başarılı!
        </h1>
        <p className="text-gray-600 mb-6">
          Ödemeniz başarıyla tamamlandı. Siparişiniz onaylandı ve hazırlık aşamasına geçti.
        </p>

        {/* Transaction Details */}
        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">İşlem Numarası</div>
            <div className="font-mono text-sm font-medium">{transactionId}</div>
          </div>
        )}

        {/* Order Details */}
        {orderId && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800 mb-1">Sipariş Numarası</div>
            <div className="font-mono text-sm font-medium text-blue-900">#{orderId}</div>
          </div>
        )}

        {/* Next Steps */}
        <div className="text-left mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Sırada Ne Var?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Siparişiniz onaylandı
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Siparişiniz hazırlanıyor
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Kargo takip numarası gönderilecek
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              E-posta ile bilgilendirme alacaksınız
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors block text-center font-medium"
            >
              Siparişi Takip Et
            </Link>
          )}
          <Link
            href="/products"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block text-center font-medium"
          >
            Alışverişe Devam Et
          </Link>
        </div>

        {/* Auto Redirect Info */}
        <div className="mt-6 text-xs text-gray-500">
          {countdown > 0 && (
            <p>
              {countdown} saniye sonra {orderId ? 'sipariş takip sayfasına' : 'ana sayfaya'} yönlendirileceksiniz
            </p>
          )}
        </div>
      </div>
    </div>
  );
}