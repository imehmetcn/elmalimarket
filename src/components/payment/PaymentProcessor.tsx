'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentProcessorProps {
  orderId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardInfo?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  };
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export default function PaymentProcessor({
  orderId,
  amount,
  paymentMethod,
  cardInfo,
  onSuccess,
  onError,
}: PaymentProcessorProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processPayment = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId,
          paymentMethod,
          cardInfo,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (response.ok && data.success) {
        // Payment successful
        setTimeout(() => {
          onSuccess(data.data.transactionId);
        }, 500);
      } else {
        // Payment failed
        onError(data.error || 'Ödeme işlemi başarısız');
      }
    } catch (error) {
      onError('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'bank_transfer':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'cash_on_delivery':
        return (
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return 'Kredi Kartı';
      case 'bank_transfer':
        return 'Banka Havalesi';
      case 'cash_on_delivery':
        return 'Kapıda Ödeme';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {getPaymentMethodIcon()}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Ödeme İşlemi
        </h2>
        <p className="text-gray-600">
          {getPaymentMethodName()} ile {formatPrice(amount)}
        </p>
      </div>

      {/* Payment Details */}
      {paymentMethod === 'credit_card' && cardInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Kart Bilgileri</div>
          <div className="font-mono text-sm">
            **** **** **** {cardInfo.cardNumber.slice(-4)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {cardInfo.cardHolder}
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">İşleniyor...</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">
              Lütfen bekleyin, ödemeniz işleniyor...
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!isProcessing && (
        <button
          onClick={processPayment}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Ödemeyi Tamamla
        </button>
      )}

      {/* Security Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <div className="text-sm font-medium text-blue-900">Güvenli Ödeme</div>
            <div className="text-sm text-blue-700">
              Ödeme bilgileriniz SSL ile şifrelenir ve güvenli şekilde işlenir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}