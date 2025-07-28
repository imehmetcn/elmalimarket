'use client';

import { useState } from 'react';
import Link from 'next/link';

const elmaliProducts = [
  { id: 1, name: 'Elmalı Turta Dilim', price: 24.90, originalPrice: 29.90, image: 'https://images.unsplash.com/photo-1621303837174-89787a4d4729?w=300&h=300&fit=crop&crop=center', discount: 17, unit: 'TL' },
  { id: 2, name: 'Elmalı Kurabiye 200g', price: 19.90, originalPrice: 24.90, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop&crop=center', discount: 20, unit: 'TL' },
  { id: 3, name: 'Elmalı Çay 20\'li', price: 34.90, originalPrice: 39.90, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop&crop=center', discount: 13, unit: 'TL' },
  { id: 4, name: 'Elmalı Reçel 380g', price: 29.90, originalPrice: 34.90, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop&crop=center', discount: 14, unit: 'TL' },
  { id: 5, name: 'Elmalı Muffin 6\'lı', price: 39.90, originalPrice: 49.90, image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=300&fit=crop&crop=center', discount: 20, unit: 'TL' },
  { id: 6, name: 'Elmalı Sirke 500ml', price: 14.90, originalPrice: 19.90, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&crop=center', discount: 25, unit: 'TL' }
];

export default function ElmaliProductsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, elmaliProducts.length - itemsPerView);

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-600">Elmalı Ürünleri</h2>
          <div className="flex items-center gap-2">
            <Link href="/products?category=elmali" className="text-green-600 hover:text-green-800 text-sm">Tüm Ürünleri Gör</Link>
            <button onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))} disabled={currentIndex === 0} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-50">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrentIndex(prev => Math.min(prev + 1, maxIndex))} disabled={currentIndex >= maxIndex} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-50">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="relative h-64 lg:h-full rounded-xl overflow-hidden shadow-lg group cursor-pointer">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop&crop=center')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-green-700/85 to-green-800/90" />
              <div className="relative h-full flex flex-col justify-center items-center text-center p-6">
                <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">🍎</h3>
                <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">Elmalı</h3>
                <p className="text-green-100 text-sm opacity-90">Elma lezzetli ürünler</p>
                <button className="mt-6 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">Keşfet</button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
                {elmaliProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-1/3 px-2">
                    <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-medium text-gray-800 mb-3 text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                      <div className="mb-2"><span className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full">CarrefourSA Kart ile</span></div>
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} {product.unit}</span>
                          {product.originalPrice && <span className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} {product.unit}</span>}
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">Sepete Ekle</button>
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