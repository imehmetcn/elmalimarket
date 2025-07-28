'use client';

import { useState } from 'react';
import Link from 'next/link';

// Gerçek et, balık, tavuk ürünleri
const meatProducts = [
  {
    id: 1,
    name: 'Dana Kıyma (%14-%20 Yağ) Kg',
    price: 499.90,
    originalPrice: 669.90,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=300&fit=crop&crop=center',
    discount: 25,
    unit: 'TL',
    category: 'Et'
  },
  {
    id: 2,
    name: 'Çipura Balığı 400-600g',
    price: 279.90,
    originalPrice: 299.90,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop&crop=center',
    discount: 7,
    unit: 'TL',
    category: 'Balık'
  },
  {
    id: 3,
    name: 'Tavuk But Pirzola Kg',
    price: 129.90,
    originalPrice: 159.90,
    image: 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?w=300&h=300&fit=crop&crop=center',
    discount: 19,
    unit: 'TL',
    category: 'Tavuk'
  },
  {
    id: 4,
    name: 'Taze Somon Fileto Kg',
    price: 389.90,
    originalPrice: 449.90,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=300&fit=crop&crop=center',
    discount: 13,
    unit: 'TL',
    category: 'Balık'
  },
  {
    id: 5,
    name: 'Kuzu Pirzola Kg',
    price: 899.90,
    originalPrice: 999.90,
    image: 'https://images.unsplash.com/photo-1588347818133-38c4106c7c8d?w=300&h=300&fit=crop&crop=center',
    discount: 10,
    unit: 'TL',
    category: 'Et'
  },
  {
    id: 6,
    name: 'Tavuk Göğsü Fileto Kg',
    price: 89.90,
    originalPrice: 109.90,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop&crop=center',
    discount: 18,
    unit: 'TL',
    category: 'Tavuk'
  },
  {
    id: 7,
    name: 'Levrek Balığı 500-700g',
    price: 199.90,
    originalPrice: 229.90,
    image: 'https://images.unsplash.com/photo-1535140728325-781d5ecd3f3d?w=300&h=300&fit=crop&crop=center',
    discount: 13,
    unit: 'TL',
    category: 'Balık'
  },
  {
    id: 8,
    name: 'Dana Antrikot Kg',
    price: 699.90,
    originalPrice: 799.90,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop&crop=center',
    discount: 13,
    unit: 'TL',
    category: 'Et'
  },
  {
    id: 9,
    name: 'Tavuk Kanat Kg',
    price: 69.90,
    originalPrice: 79.90,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&h=300&fit=crop&crop=center',
    discount: 13,
    unit: 'TL',
    category: 'Tavuk'
  },
  {
    id: 10,
    name: 'Hamsi Balığı Kg',
    price: 49.90,
    originalPrice: 59.90,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
    discount: 17,
    unit: 'TL',
    category: 'Balık'
  },
  {
    id: 11,
    name: 'Dana Bonfile Kg',
    price: 1299.90,
    originalPrice: 1499.90,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300&h=300&fit=crop&crop=center',
    discount: 13,
    unit: 'TL',
    category: 'Et'
  },
  {
    id: 12,
    name: 'Tavuk Bütün Kg',
    price: 59.90,
    originalPrice: 69.90,
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&h=300&fit=crop&crop=center',
    discount: 14,
    unit: 'TL',
    category: 'Tavuk'
  }
];

export default function MeatSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Desktop'ta 3 ürün göster
  const maxIndex = Math.max(0, meatProducts.length - itemsPerView);

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
          <h2 className="text-2xl font-bold text-blue-600">Et, Balık, Tavuk</h2>
          <div className="flex items-center gap-2">
            <Link href="/products?category=meat" className="text-blue-600 hover:text-blue-800 text-sm">
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
                  backgroundImage: `url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop&crop=center')`,
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
                    Et
                  </h3>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    Balık
                  </h3>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    Tavuk
                  </h3>
                </div>
                
                {/* Subtitle */}
                <p className="text-blue-100 text-sm mt-4 opacity-90">
                  Taze ve kaliteli protein kaynakları
                </p>
                
                {/* CTA Button */}
                <button className="mt-6 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">
                  Keşfet
                </button>
              </div>
              
              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
            </div>
          </div>

          {/* Right Side - Products Slider */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {meatProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-1/3 px-2">
                    <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
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