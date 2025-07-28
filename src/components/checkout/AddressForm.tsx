'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Address, AuthUser } from '@/types';

interface AddressFormProps {
  user: AuthUser | null;
  savedAddresses: Address[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  useNewAddress: boolean;
  setUseNewAddress: (use: boolean) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function AddressForm({
  user,
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  useNewAddress,
  setUseNewAddress,
  register,
  errors,
}: AddressFormProps) {
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
    'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
    'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
    'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
    'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'İçel', 'İstanbul', 'İzmir',
    'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
    'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
    'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
    'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale',
    'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis',
    'Osmaniye', 'Düzce'
  ];

  return (
    <div className="space-y-6">
      {/* Saved Addresses (for logged-in users) */}
      {user && savedAddresses.length > 0 && !useNewAddress && (
        <div>
          <h3 className="font-medium mb-4">Kayıtlı Adreslerim</h3>
          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <label
                key={address.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddressId === address.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="selectedAddress"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="sr-only"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      {address.title}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {address.firstName} {address.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.address}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.district}, {address.city} {address.postalCode}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.phone}
                    </div>
                  </div>
                  {selectedAddressId === address.id && (
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </label>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setUseNewAddress(true)}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            + Yeni Adres Ekle
          </button>
        </div>
      )}

      {/* New Address Form */}
      {(useNewAddress || !user || savedAddresses.length === 0) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              {useNewAddress ? 'Yeni Adres' : 'Teslimat Adresi'}
            </h3>
            {useNewAddress && (
              <button
                type="button"
                onClick={() => setUseNewAddress(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                İptal
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres Başlığı *
              </label>
              <input
                type="text"
                {...register('shippingAddress.title', { 
                  required: 'Adres başlığı gerekli' 
                })}
                placeholder="Ev, İş, vb."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.title.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad *
              </label>
              <input
                type="text"
                {...register('shippingAddress.firstName', { 
                  required: 'Ad gerekli' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.firstName.message}
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
                {...register('shippingAddress.lastName', { 
                  required: 'Soyad gerekli' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.lastName.message}
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
                {...register('shippingAddress.phone', { 
                  required: 'Telefon gerekli',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Geçerli bir telefon numarası girin'
                  }
                })}
                placeholder="05XX XXX XX XX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.phone.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İl *
              </label>
              <select
                {...register('shippingAddress.city', { 
                  required: 'İl seçimi gerekli' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">İl Seçin</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.shippingAddress?.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.city.message}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İlçe *
              </label>
              <input
                type="text"
                {...register('shippingAddress.district', { 
                  required: 'İlçe gerekli' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.district.message}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posta Kodu *
              </label>
              <input
                type="text"
                {...register('shippingAddress.postalCode', { 
                  required: 'Posta kodu gerekli',
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: '5 haneli posta kodu girin'
                  }
                })}
                placeholder="34000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.postalCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.postalCode.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres *
              </label>
              <textarea
                {...register('shippingAddress.address', { 
                  required: 'Adres gerekli',
                  minLength: {
                    value: 10,
                    message: 'Adres en az 10 karakter olmalı'
                  }
                })}
                rows={3}
                placeholder="Mahalle, sokak, bina no, daire no"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.shippingAddress?.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.address.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}