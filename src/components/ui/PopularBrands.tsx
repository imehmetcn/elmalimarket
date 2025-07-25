'use client';

const brands = [
  {
    id: 1,
    name: 'Ülker',
    logo: '/brands/ulker.png',
    description: 'Gıda ve içecek'
  },
  {
    id: 2,
    name: 'Eti',
    logo: '/brands/eti.png',
    description: 'Bisküvi ve çikolata'
  },
  {
    id: 3,
    name: 'Pınar',
    logo: '/brands/pinar.png',
    description: 'Süt ürünleri'
  },
  {
    id: 4,
    name: 'Torku',
    logo: '/brands/torku.png',
    description: 'Şeker ve gıda'
  },
  {
    id: 5,
    name: 'Coca Cola',
    logo: '/brands/cocacola.png',
    description: 'İçecekler'
  },
  {
    id: 6,
    name: 'Nestle',
    logo: '/brands/nestle.png',
    description: 'Gıda ve içecek'
  }
];

export default function PopularBrands() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popüler Markalar
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Güvendiğiniz markaların en kaliteli ürünleri
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-300"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-50 transition-colors">
                {/* Placeholder for brand logo */}
                <div className="text-2xl font-bold text-gray-400 group-hover:text-primary-600 transition-colors">
                  {brand.name.charAt(0)}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-gray-500">{brand.description}</p>
            </div>
          ))}
        </div>

        {/* Brand Showcase */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Kaliteli Markalarla Tanışın
              </h3>
              <p className="text-gray-600 mb-6">
                Türkiye'nin en sevilen markalarından binlerce ürün. 
                Kalite garantisi ve uygun fiyatlarla alışverişin keyfini çıkarın.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Orijinal ürünler</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Hızlı teslimat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">En iyi fiyatlar</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                {brands.slice(0, 6).map((brand, index) => (
                  <div
                    key={brand.id}
                    className={`bg-gray-50 rounded-lg p-4 flex items-center justify-center ${
                      index % 2 === 0 ? 'animate-pulse' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  >
                    <div className="text-lg font-bold text-gray-400">
                      {brand.name.charAt(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}