'use client';

import { useState } from 'react';
import Link from 'next/link';

// Gerçek meyve ve sebze ürünleri
const fruitsVegetablesProducts = [
  {
    id: 1,
    name: 'Patates Yemelik Kg',
    price: 14.90,
    originalPrice: 19.90,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop&crop=center',
    discount: 25,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 2,
    name: 'Çangelköy Salatalık Kg',
    price: 22.90,
    originalPrice: 29.90,
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center',
    discount: 23,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 3,
    name: 'Havuç Kg',
    price: 64.90,
    originalPrice: 79.90,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center',
    discount: 19,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 4,
    name: 'Elma Starking Kg',
    price: 29.90,
    originalPrice: 39.90,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
    discount: 25,
    unit: 'TL',
    category: 'Meyve'
  },
  {
    id: 5,
    name: 'Domates Salçalık Kg',
    price: 34.90,
    originalPrice: 44.90,
    image: 'https://images.unsplash.com/photo-1546470427-e5380b6d0b66?w=300&h=300&fit=crop&crop=center',
    discount: 22,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 6,
    name: 'Muz Kg',
    price: 49.90,
    originalPrice: 59.90,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center',
    discount: 17,
    unit: 'TL',
    category: 'Meyve'
  },
  {
    id: 7,
    name: 'Soğan Kuru Kg',
    price: 19.90,
    originalPrice: 24.90,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&h=300&fit=crop&crop=center',
    discount: 20,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 8,
    name: 'Portakal Valencia Kg',
    price: 39.90,
    originalPrice: 49.90,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop&crop=center',
    discount: 20,
    unit: 'TL',
    category: 'Meyve'
  },
  {
    id: 9,
    name: 'Biber Dolmalık Kg',
    price: 89.90,
    originalPrice: 109.90,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop&crop=center',
    discount: 18,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 10,
    name: 'Limon Kg',
    price: 59.90,
    originalPrice: 69.90,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=300&h=300&fit=crop&crop=center',
    discount: 14,
    unit: 'TL',
    category: 'Meyve'
  },
  {
    id: 11,
    name: 'Patlıcan Kg',
    price: 44.90,
    originalPrice: 54.90,
    image: 'https://images.unsplash.com/photo-1518663205015-1ba2f0b93a8d?w=300&h=300&fit=crop&crop=center',
    discount: 18,
    unit: 'TL',
    category: 'Sebze'
  },
  {
    id: 12,
    name: 'Armut Santa Maria Kg',
    price: 79.90,
    originalPrice: 99.90,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop&crop=center',
    discount: 20,
    unit: 'TL',
    category: 'Meyve'
  }
];

export default function FruitsVegetablesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Desktop'ta 3 ürün göster
  const maxIndex = Math.max(0, fruitsVegetablesProducts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Taze Meyve & Sebze Ürünleri</h2>
          <div className="flex items-center gap-2">
            <Link href="/products?category=fruits-vegetables" className="text-blue-600 hover:text-blue-800 text-sm">
              Tüm Ürünleri Gör
            </Link>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Category Banner */}
          <div className="lg:col-span-1">
            <div className="relative h-64 lg:h-full rounded-xl overflow-hidden shadow-lg group cursor-pointer">
              {/* Background Image */}
              <div 
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop&crop=center')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/85 to-blue-800/90" />
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-6 left-4 w-12 h-12 bg-white/5 rounded-full blur-lg" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-center text-center p-6">
                <div className="space-y-2">
                  <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    Meyve
                  </h3>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    Sebze
                  </h3>
                </div>
                
                {/* Subtitle */}
                <p className="text-blue-100 text-sm mt-4 opacity-90">
                  Taze ve organik ürünler
                </p>
                
                {/* CTA Button */}
                <button className="mt-6 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">
                  Keşfet
                </button>
              </div>
              
              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
            </div>
          </div>

          {/* Right Side - Products Slider */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {fruitsVegetablesProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-1/3 px-2">
                    <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <h3 className="font-medium text-gray-800 mb-3 text-sm line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      {/* CarrefourSA Badge */}
                      <div className="mb-2">
                        <span className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full">
                          CarrefourSA Kart ile
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} {product.unit}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} {product.unit}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        Sepete Ekle
                      </button>
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