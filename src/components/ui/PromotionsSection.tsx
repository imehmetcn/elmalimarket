import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const promotions = [
  {
    id: 1,
    title: 'Meyve & Sebze',
    discount: '%25',
    description: 'Taze meyve ve sebzelerde',
    bgColor: 'from-green-400 to-green-600',
    icon: '🥕',
    validUntil: '31 Ocak'
  },
  {
    id: 2,
    title: 'Süt Ürünleri',
    discount: '%20',
    description: 'Tüm süt ürünlerinde',
    bgColor: 'from-blue-400 to-blue-600',
    icon: '🥛',
    validUntil: '28 Ocak'
  },
  {
    id: 3,
    title: 'Fırın Ürünleri',
    discount: '%15',
    description: 'Günlük taze ekmeklerde',
    bgColor: 'from-orange-400 to-orange-600',
    icon: '🍞',
    validUntil: '30 Ocak'
  }
];

export default function PromotionsSection() {
  return (
    <section className="py-12 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔥 Güncel Kampanyalar
            </h2>
            <p className="text-gray-600 text-sm">
              Sınırlı süre için özel indirimler
            </p>
          </div>
          <Link
            href="/campaigns"
            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>Tüm Kampanyalar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={`/campaigns/${promo.id}`}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${promo.bgColor} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{promo.icon}</div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${promo.bgColor} text-white rounded-full text-sm font-bold`}>
                    {promo.discount} İNDİRİM
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {promo.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {promo.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Son: {promo.validUntil}
                  </span>
                  <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                    <span>Detaylar</span>
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-red-300 rounded-full animate-pulse delay-1000"></div>
            </Link>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">Sıcak Fırsat!</span>
          </div>
          <p className="text-sm opacity-90">
            Bu hafta içinde 200₺ ve üzeri alışverişlerinizde <span className="font-bold">ücretsiz express teslimat</span>
          </p>
        </div>
      </div>
    </section>
  );
}