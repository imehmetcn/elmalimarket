const features = [
  {
    icon: '💰',
    title: 'Uygun Fiyatlar',
    description: 'En kaliteli ürünleri en uygun fiyatlarla sizlere sunuyoruz.',
  },
  {
    icon: '⚡',
    title: 'Hızlı Teslimat',
    description: 'Siparişlerinizi en kısa sürede kapınıza kadar getiriyoruz.',
  },
  {
    icon: '🔒',
    title: 'Güvenli Alışveriş',
    description: 'SSL sertifikası ile korunan güvenli ödeme sistemi.',
  },
  {
    icon: '🎯',
    title: 'Kalite Garantisi',
    description: 'Tüm ürünlerimiz kalite kontrolünden geçer.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Size Özel Avantajlar
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Müşteri memnuniyeti odaklı hizmet anlayışımızla en iyi alışveriş deneyimini sunuyoruz.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group text-center p-6 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors text-xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}