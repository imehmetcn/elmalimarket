import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Elmalı Market'e Hoş Geldiniz
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Kaliteli ürünleri uygun fiyatlarla, kapınıza kadar getiriyoruz.
            Online alışverişin keyfini çıkarın!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={ROUTES.PRODUCTS}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Ürünleri İncele
            </Link>
            <Link
              href={ROUTES.CATEGORIES}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
            >
              Kategoriler
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}