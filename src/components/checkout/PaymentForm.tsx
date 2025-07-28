'use client';

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

interface PaymentFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

export default function PaymentForm({
  register,
  errors,
  watch,
}: PaymentFormProps) {
  const paymentMethod = watch('paymentMethod');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="font-medium mb-4">Ödeme Yöntemi</h3>
        <div className="space-y-3">
          {/* Credit Card */}
          <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'credit_card'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              value="credit_card"
              {...register('paymentMethod')}
              className="sr-only"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Kredi Kartı</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                </div>
              </div>
              {paymentMethod === 'credit_card' && (
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>

          {/* Bank Transfer */}
          <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'bank_transfer'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              value="bank_transfer"
              {...register('paymentMethod')}
              className="sr-only"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Banka Havalesi</div>
                  <div className="text-sm text-gray-600">Havale/EFT ile ödeme</div>
                </div>
              </div>
              {paymentMethod === 'bank_transfer' && (
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>

          {/* Cash on Delivery */}
          <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'cash_on_delivery'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              value="cash_on_delivery"
              {...register('paymentMethod')}
              className="sr-only"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded mr-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Kapıda Ödeme</div>
                  <div className="text-sm text-gray-600">Nakit veya kart ile kapıda ödeme</div>
                </div>
              </div>
              {paymentMethod === 'cash_on_delivery' && (
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === 'credit_card' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Kart Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Holder Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kart Üzerindeki İsim *
              </label>
              <input
                type="text"
                {...register('cardInfo.cardHolder', { 
                  required: paymentMethod === 'credit_card' ? 'Kart sahibi adı gerekli' : false 
                })}
                placeholder="JOHN DOE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
              />
              {errors.cardInfo?.cardHolder && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardInfo.cardHolder.message}
                </p>
              )}
            </div>

            {/* Card Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kart Numarası *
              </label>
              <input
                type="text"
                {...register('cardInfo.cardNumber', { 
                  required: paymentMethod === 'credit_card' ? 'Kart numarası gerekli' : false,
                  pattern: {
                    value: /^[0-9\s]{13,19}$/,
                    message: 'Geçerli bir kart numarası girin'
                  }
                })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                onChange={(e) => {
                  e.target.value = formatCardNumber(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.cardInfo?.cardNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardInfo.cardNumber.message}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Son Kullanma Tarihi *
              </label>
              <input
                type="text"
                {...register('cardInfo.expiryDate', { 
                  required: paymentMethod === 'credit_card' ? 'Son kullanma tarihi gerekli' : false,
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: 'MM/YY formatında girin'
                  }
                })}
                placeholder="MM/YY"
                maxLength={5}
                onChange={(e) => {
                  e.target.value = formatExpiryDate(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.cardInfo?.expiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardInfo.expiryDate.message}
                </p>
              )}
            </div>

            {/* CVV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                type="text"
                {...register('cardInfo.cvv', { 
                  required: paymentMethod === 'credit_card' ? 'CVV gerekli' : false,
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: '3-4 haneli CVV kodu girin'
                  }
                })}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.cardInfo?.cvv && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardInfo.cvv.message}
                </p>
              )}
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-blue-900">Güvenli Ödeme</div>
                <div className="text-sm text-blue-700">
                  Kart bilgileriniz SSL ile şifrelenir ve güvenli şekilde işlenir.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank_transfer' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Banka Bilgileri</h4>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-white rounded border">
              <div className="font-medium">Ziraat Bankası</div>
              <div className="text-gray-600">IBAN: TR12 0001 0000 0000 0000 0000 01</div>
              <div className="text-gray-600">Hesap Sahibi: Elmalı Market Ltd. Şti.</div>
            </div>
            <div className="p-3 bg-white rounded border">
              <div className="font-medium">İş Bankası</div>
              <div className="text-gray-600">IBAN: TR12 0006 4000 0000 0000 0000 01</div>
              <div className="text-gray-600">Hesap Sahibi: Elmalı Market Ltd. Şti.</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-yellow-900">Önemli Not</div>
                <div className="text-sm text-yellow-700">
                  Havale/EFT açıklamasına sipariş numaranızı yazınız. Ödeme onaylandıktan sonra siparişiniz hazırlanacaktır.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash on Delivery Info */}
      {paymentMethod === 'cash_on_delivery' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Kapıda Ödeme</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-sm">
                <div className="font-medium">Nakit Ödeme</div>
                <div className="text-gray-600">Siparişinizi teslim alırken nakit olarak ödeyebilirsiniz.</div>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-sm">
                <div className="font-medium">Kart ile Ödeme</div>
                <div className="text-gray-600">Kurye yanında POS cihazı ile kart ödemesi yapabilirsiniz.</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-orange-900">Kapıda Ödeme Koşulları</div>
                <div className="text-sm text-orange-700">
                  • Maksimum sipariş tutarı: 500 TL<br/>
                  • Ek kargo ücreti: 5 TL<br/>
                  • Sadece İstanbul içi teslimat
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sipariş Notu (Opsiyonel)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Siparişiniz hakkında özel bir notunuz varsa buraya yazabilirsiniz..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    </div>
  );
}