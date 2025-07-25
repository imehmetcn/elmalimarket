import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-primary-100/20 to-green-100/20"></div>
      </div>
      
      <div className="container-custom relative z-10 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-semibold shadow-lg">
                  🍎 Türkiye'nin En Taze Marketi
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Taze ürünler
                  <span className="block text-primary-600 relative">
                    kapınızda
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-200" viewBox="0 0 300 12" fill="currentColor">
                      <path d="M0,8 Q150,0 300,8 L300,12 L0,12 Z" />
                    </svg>
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Kaliteli ve taze ürünleri en uygun fiyatlarla, hızlı teslimatla kapınıza getiriyoruz. 
                  <span className="font-semibold text-primary-600">150₺ üzeri ücretsiz kargo!</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                  </svg>
                  Alışverişe Başla
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link
                  href={ROUTES.CATEGORIES}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Kategoriler
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">5000+</div>
                  <div className="text-sm text-gray-600">Ürün Çeşidi</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Müşteri Desteği</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">⚡</div>
                  <div className="text-sm text-gray-600">Aynı Gün Teslimat</div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Güvenli Ödeme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Kolay İade</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Taze Garanti</span>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              {/* Main Shopping Cart Visual */}
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Kolay Alışveriş</h3>
                  <p className="text-gray-600 text-sm">
                    Birkaç tıkla istediğiniz ürünleri sepete ekleyin
                  </p>
                  
                  {/* Sample Products */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-lg">🍎</div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">Elma</div>
                          <div className="text-xs text-gray-500">1 kg</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary-600">₺12.99</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-lg">🥕</div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">Havuç</div>
                          <div className="text-xs text-gray-500">500g</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary-600">₺8.50</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-lg">🍅</div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">Domates</div>
                          <div className="text-xs text-gray-500">1 kg</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary-600">₺15.00</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Toplam:</span>
                      <span className="text-lg font-bold text-gray-900">₺36.49</span>
                    </div>
                    <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ✓ Taze
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                🚚 Hızlı
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}