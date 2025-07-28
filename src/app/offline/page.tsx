import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çevrimdışı - Elmalı Market',
  description: 'İnternet bağlantınızı kontrol edin',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center p-6">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            İnternet Bağlantısı Yok
          </h1>
          <p className="text-gray-600 mb-6">
            İnternet bağlantınızı kontrol edin ve tekrar deneyin.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Tekrar Dene
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Geri Dön
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            Çevrimdışı Özellikler
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Daha önce görüntülenen ürünler</li>
            <li>• Sepet içeriği korunur</li>
            <li>• Favoriler listesi</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Elmalı Market - Her zaman yanınızda</p>
        </div>
      </div>
    </div>
  );
}