'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import TouchButton from '@/components/ui/TouchButton';

export default function MockPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const token = searchParams.get('token');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!token || !orderId) {
      router.push('/');
      return;
    }

    // Countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePaymentSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [token, orderId]);

  const handlePaymentSuccess = async () => {
    setLoading(true);
    
    try {
      // Simulate payment success webhook
      const webhookResponse = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          merchant_oid: orderId!,
          status: 'success',
          total_amount: '1000', // Mock amount
          hash: 'mock_hash_' + Date.now(),
        }),
      });

      if (webhookResponse.ok) {
        router.push(`/payment/success?orderId=${orderId}`);
      } else {
        throw new Error('Webhook failed');
      }
    } catch (error) {
      console.error('Mock payment error:', error);
      router.push(`/payment/error?orderId=${orderId}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = async () => {
    setLoading(true);
    
    try {
      // Simulate payment failure webhook
      const webhookResponse = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          merchant_oid: orderId!,
          status: 'failed',
          total_amount: '1000', // Mock amount
          hash: 'mock_hash_' + Date.now(),
          failed_reason_code: 'INSUFFICIENT_FUNDS',
          failed_reason_msg: 'Yetersiz bakiye',
        }),
      });

      router.push(`/payment/error?orderId=${orderId}`);
    } catch (error) {
      console.error('Mock payment failure error:', error);
      router.push(`/payment/error?orderId=${orderId}`);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !orderId) {
    return null;
  }

  return (
    <Container className="py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mock Ödeme Sayfası
            </h1>
            <p className="text-gray-600">
              Bu test amaçlı bir ödeme sayfasıdır
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Sipariş ID:</div>
            <div className="font-mono text-sm">{orderId}</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              {countdown > 0 ? (
                <>Otomatik olarak başarılı ödeme simülasyonu {countdown} saniye içinde başlayacak...</>
              ) : (
                'Ödeme işlemi simüle ediliyor...'
              )}
            </p>
          </div>

          <div className="space-y-3">
            <TouchButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePaymentSuccess}
              loading={loading}
              disabled={loading}
            >
              ✅ Başarılı Ödeme Simüle Et
            </TouchButton>
            
            <TouchButton
              variant="danger"
              size="lg"
              fullWidth
              onClick={handlePaymentFailure}
              loading={loading}
              disabled={loading}
            >
              ❌ Başarısız Ödeme Simüle Et
            </TouchButton>
            
            <TouchButton
              variant="outline"
              size="md"
              fullWidth
              onClick={() => router.push('/')}
              disabled={loading}
            >
              Ana Sayfaya Dön
            </TouchButton>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Bu sayfa sadece geliştirme ortamında görünür.</p>
            <p>Gerçek ödeme işlemleri PayTR üzerinden yapılacaktır.</p>
          </div>
        </div>
      </div>
    </Container>
  );
}