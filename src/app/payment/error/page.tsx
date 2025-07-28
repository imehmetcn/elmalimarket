'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');
  const errorCode = searchParams.get('errorCode');

  useEffect(() => {
    // Redirect countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (orderId) {
            router.push(`/checkout`);
          } else {
            router.push('/cart');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'CARD_DECLINED':
        return 'Kartınız reddedildi. Lütfen kart bilgilerinizi kontrol edin veya farklı bir kart deneyin.';
      case 'INSUFFICIENT_FUNDS':
        return 'Kartınızda yeterli bakiye bulunmuyor. Lütfen farklı bir kart deneyin.';
      case 'EXPIRED_CARD':
        return 'Kartınızın süresi dolmuş. Lütfen geçerli bir kart kullanın.';
      case 'INVALID_CVV':
        return 'CVV kodu hatalı. Lütfen kartınızın arkasındaki 3 haneli kodu kontrol edin.';
      case 'NETWORK_ERROR':
        return 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.';
      case 'TIMEOUT':
        return 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.';
      default:
        return error || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
    }
  };

  const getErrorIcon = () => {
    switch (errorCode) {
      case 'CARD_DECLINED':
      case 'INSUFFICIENT_FUNDS':
      case 'EXPIRED_CARD':
      case 'INVALID_CVV':
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  const getSolutions = () => {
    switch (errorCode) {
      case 'CARD_DECLINED':
        return [
          'Kart bilgilerinizi kontrol edin',
          'Farklı bir kart deneyin',
          'Bankanızla iletişime geçin',
          'Banka havalesi ile ödeme yapın',
        ];
      case 'INSUFFICIENT_FUNDS':
        return [
          'Kartınıza yeterli bakiye yükleyin',
          'Farklı bir kart kullanın',
          'Banka havalesi ile ödeme yapın',
          'Kapıda ödeme seçeneğini deneyin',
        ];
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
        return [
          'Internet bağlantınızı kontrol edin',
          'Sayfayı yenileyin ve tekrar deneyin',
          'Farklı bir tarayıcı kullanın',
          'Daha sonra tekrar deneyin',
        ];
      default:
        return [
          'Kart bilgilerinizi kontrol edin',
          'Farklı bir ödeme yöntemi deneyin',
          'Sayfayı yenileyin ve tekrar deneyin',
          'Müşteri hizmetleri ile iletişime geçin',
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          {getErrorIcon()}
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {/* Error Code */}
        {errorCode && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-red-800 mb-1">Hata Kodu</div>
            <div className="font-mono text-sm font-medium text-red-900">{errorCode}</div>
          </div>
        )}

        {/* Solutions */}
        <div className="text-left mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Çözüm Önerileri</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {getSolutions().map((solution, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {solution}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors block text-center font-medium"
          >
            Tekrar Dene
          </Link>
          <Link
            href="/cart"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block text-center font-medium"
          >
            Sepete Dön
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800 mb-2">
            <strong>Yardıma mı ihtiyacınız var?</strong>
          </div>
          <div className="text-sm text-blue-700">
            Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.
          </div>
          <div className="mt-2">
            <a
              href="tel:+905551234567"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              📞 0555 123 45 67
            </a>
            <span className="mx-2 text-blue-400">|</span>
            <a
              href="mailto:destek@elmalimarket.com"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ✉️ destek@elmalimarket.com
            </a>
          </div>
        </div>

        {/* Auto Redirect Info */}
        <div className="mt-6 text-xs text-gray-500">
          {countdown > 0 && (
            <p>
              {countdown} saniye sonra checkout sayfasına yönlendirileceksiniz
            </p>
          )}
        </div>
      </div>
    </div>
  );
}