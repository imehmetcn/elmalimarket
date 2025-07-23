import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function CTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Hemen Alışverişe Başlayın
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Binlerce ürün arasından seçim yapın ve kapınıza kadar getirtelim.
          Kaliteli ürünler, uygun fiyatlar, hızlı teslimat!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Alışverişe Başla
          </Link>
          <Link
            href={ROUTES.CATEGORIES}
            className="inline-block border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
          >
            Kategorileri İncele
          </Link>
        </div>
      </div>
    </section>
  );
}