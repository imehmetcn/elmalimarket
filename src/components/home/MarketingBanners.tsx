'use client';

import Link from 'next/link';

export default function MarketingBanners() {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alışveriş Kartları Banner */}
          <Link href="/cards" className="group">
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/images/footerbanner1.jpg" 
                alt="Alışveriş Kartları - Ticket Restaurant, Sodexo, Pluxee, Token Flex"
                className="w-full h-auto"
              />
            </div>
          </Link>

          {/* Social Media Banner */}
          <Link href="/social" className="group">
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/images/footerbanner2.jpg" 
                alt="Instagram Takip - @barisgross sayfasını takip et, fırsatları kaçırma"
                className="w-full h-auto"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}