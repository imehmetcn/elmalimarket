'use client';

import Link from 'next/link';

// Mock data - gerçek projede API'den gelecek
const bestSellers = [
  {
    id: 1,
    name: 'Organik Domates 1kg',
    price: 12.50,
    originalPrice: 15.00,
    image: 'https://images.unsplash.com/photo-1546470427-e5380b6d0b66?w=300&h=300&fit=crop&crop=center',
    discount: 17
  },
  {
    id: 2,
    name: 'Taze Tavuk But',
    price: 45.90,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?w=300&h=300&fit=crop&crop=center',
    discount: 0
  },
  {
    id: 3,
    name: 'Tam Yağlı Süt 1L',
    price: 8.75,
    originalPrice: 10.00,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop&crop=center',
    discount: 13
  },
  {
    id: 4,
    name: 'Köy Ekmeği',
    price: 6.50,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center',
    discount: 0
  },
  {
    id: 5,
    name: 'Dondurulmuş Karışık Sebze',
    price: 18.90,
    originalPrice: 22.00,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop&crop=center',
    discount: 14
  },
  {
    id: 6,
    name: 'Premium Zeytinyağı 500ml',
    price: 89.90,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&crop=center',
    discount: 25
  },
  {
    id: 7,
    name: 'Organik Bal 250g',
    price: 65.00,
    originalPrice: 85.00,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop&crop=center',
    discount: 24
  },
  {
    id: 8,
    name: 'Antep Fıstığı 250g',
    price: 95.50,
    originalPrice: 125.00,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop&crop=center',
    discount: 24
  },
  {
    id: 9,
    name: 'Taze Muz 1kg',
    price: 18.50,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center',
    discount: 0
  }
];

export default function BestSellersSlider() {
  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-600">Çok Satanlar</h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {bestSellers.slice(0, 6).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Name */}
              <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>
              
              {/* CarrefourSA Card */}
              <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded mb-2 text-center">
                CarrefourSA Kartı ile
              </div>
              
              {/* Prices */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} TL</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} TL</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}