'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CartItem, Address, AuthUser } from '@/types';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import GuestForm from './GuestForm';

interface CheckoutFormProps {
  cartItems: CartItem[];
  user: AuthUser | null;
  onOrderComplete: (orderId: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface CheckoutFormData {
  // Guest user info (if not logged in)
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  
  // Shipping address
  shippingAddress: {
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
  };
  
  // Payment info
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardInfo?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  };
  
  // Additional
  notes?: string;
  acceptTerms: boolean;
}

export default function CheckoutForm({
  cartItems,
  user,
  onOrderComplete,
  onError,
  isLoading,
  setIsLoading,
}: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(!user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: 'credit_card',
      acceptTerms: false,
    },
  });

  // Load saved addresses for logged-in users
  useEffect(() => {
    if (user) {
      loadSavedAddresses();
    }
  }, [user]);

  const loadSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data.data || []);
        
        // Select default address if available
        const defaultAddress = data.data?.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      let orderId: string;
      let shippingAddressId = selectedAddressId;

      // If using new address or guest checkout, create address first
      if (useNewAddress || isGuestCheckout || !selectedAddressId) {
        const addressData = {
          ...data.shippingAddress,
          isDefault: false,
        };

        // For guest users, we'll create a temporary address
        if (isGuestCheckout) {
          // Create guest order with address
          const guestOrderData = {
            ...orderData,
            guestInfo: data.guestInfo,
            shippingAddress: addressData,
          };

          const response = await fetch('/api/orders/guest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(guestOrderData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Sipariş oluşturulamadı');
          }

          const result = await response.json();
          orderId = result.data.id;
        } else {
          // Create new address for logged-in user
          const token = localStorage.getItem('token');
          const addressResponse = await fetch('/api/user/addresses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(addressData),
          });

          if (!addressResponse.ok) {
            throw new Error('Adres kaydedilemedi');
          }

          const addressResult = await addressResponse.json();
          shippingAddressId = addressResult.data.id;

          // Create order for logged-in user
          const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...orderData,
              shippingAddressId,
            }),
          });

          if (!orderResponse.ok) {
            const errorData = await orderResponse.json();
            throw new Error(errorData.error || 'Sipariş oluşturulamadı');
          }

          const orderResult = await orderResponse.json();
          orderId = orderResult.data.id;
        }
      } else {
        // Create order with existing address
        const token = localStorage.getItem('token');
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...orderData,
            shippingAddressId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Sipariş oluşturulamadı');
        }

        const result = await response.json();
        orderId = result.data.id;
      }

      // Process payment if credit card
      if (data.paymentMethod === 'credit_card') {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const paymentResponse = await fetch('/api/payments/process', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            orderId,
            paymentMethod: data.paymentMethod,
            cardInfo: data.cardInfo,
          }),
        });

        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok || !paymentResult.success) {
          // Redirect to payment error page
          window.location.href = `/payment/error?orderId=${orderId}&error=${encodeURIComponent(paymentResult.error || 'Ödeme başarısız')}&errorCode=${paymentResult.errorCode || 'PAYMENT_FAILED'}`;
          return;
        }

        // Redirect to payment success page
        window.location.href = `/payment/success?orderId=${orderId}&transactionId=${paymentResult.data.transactionId}`;
      } else {
        // For other payment methods, go directly to order completion
        onOrderComplete(orderId);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Teslimat Bilgileri', completed: currentStep > 1 },
    { id: 2, name: 'Ödeme Bilgileri', completed: currentStep > 2 },
    { id: 3, name: 'Onay', completed: false },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.completed || currentStep === step.id
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {step.completed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                step.completed || currentStep === step.id
                  ? 'text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Teslimat Bilgileri</h2>
            
            {/* Guest/Login Toggle */}
            {!user && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Hesabınız var mı?</h3>
                    <p className="text-sm text-gray-600">
                      Giriş yaparak daha hızlı alışveriş yapabilirsiniz
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/auth/login?redirect=/checkout'}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Giriş Yap
                  </button>
                </div>
              </div>
            )}

            {/* Guest Form */}
            {isGuestCheckout && (
              <GuestForm
                register={register}
                errors={errors}
              />
            )}

            {/* Address Selection/Form */}
            <AddressForm
              user={user}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              useNewAddress={useNewAddress}
              setUseNewAddress={setUseNewAddress}
              register={register}
              errors={errors}
            />

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Ödeme Bilgileri</h2>
            
            <PaymentForm
              register={register}
              errors={errors}
              watch={watch}
            />

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Sipariş Onayı</h2>
            
            {/* Order Summary */}
            <div className="space-y-4 mb-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Teslimat Adresi</h3>
                <div className="text-sm text-gray-600">
                  {/* Display selected address */}
                  <p>Adres bilgileri burada gösterilecek</p>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Ödeme Yöntemi</h3>
                <div className="text-sm text-gray-600">
                  {watch('paymentMethod') === 'credit_card' && 'Kredi Kartı'}
                  {watch('paymentMethod') === 'bank_transfer' && 'Banka Havalesi'}
                  {watch('paymentMethod') === 'cash_on_delivery' && 'Kapıda Ödeme'}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register('acceptTerms', { required: 'Şartları kabul etmelisiniz' })}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-600">
                  <a href="/terms" className="text-primary-600 hover:underline">
                    Kullanım şartlarını
                  </a>{' '}
                  ve{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    gizlilik politikasını
                  </a>{' '}
                  okudum ve kabul ediyorum.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}