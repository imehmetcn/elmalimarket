'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface GuestFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function GuestForm({
  register,
  errors,
}: GuestFormProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-medium text-blue-900 mb-4">İletişim Bilgileri</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad *
          </label>
          <input
            type="text"
            {...register('guestInfo.firstName', { 
              required: 'Ad gerekli' 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.guestInfo?.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.guestInfo.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Soyad *
          </label>
          <input
            type="text"
            {...register('guestInfo.lastName', { 
              required: 'Soyad gerekli' 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.guestInfo?.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.guestInfo.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-posta *
          </label>
          <input
            type="email"
            {...register('guestInfo.email', { 
              required: 'E-posta gerekli',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Geçerli bir e-posta adresi girin'
              }
            })}
            placeholder="ornek@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.guestInfo?.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.guestInfo.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon *
          </label>
          <input
            type="tel"
            {...register('guestInfo.phone', { 
              required: 'Telefon gerekli',
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: 'Geçerli bir telefon numarası girin'
              }
            })}
            placeholder="05XX XXX XX XX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.guestInfo?.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.guestInfo.phone.message}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-sm font-medium text-blue-900">Bilgi</div>
            <div className="text-sm text-blue-700">
              Sipariş durumu ve kargo bilgileri bu iletişim bilgilerine gönderilecektir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}