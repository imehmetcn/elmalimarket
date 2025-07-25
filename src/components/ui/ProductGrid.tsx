'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { API_ROUTES, ROUTES } from '@/lib/constants';

// Mock products data - resimdeki gibi ürünler
const mockProducts = [
  {
    id: 1,
    name: 'Doğanın Tadı Organik Bal',
    price: 89.90,
    originalPrice: 99.90,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviews: 156,
    category: 'Organik'
  },
  {
    id: 2,
    name: 'Premium Kahve Çekirdekleri',
    price: 124.90,
    originalPrice: 149.90,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviews: 89,
    category: 'İçecek'
  },
  {
    id: 3,
    name: 'Taze Avokado (1 Adet)',
    price: 12.50,
    originalPrice: 15.00,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    reviews: 234,
    category: 'Meyve'
  },
  {
    id: 4,
    name: 'Organik Zeytinyağı 500ml',
    price: 67.90,
    originalPrice: 79.90,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    reviews: 78,
    category: 'Temel Gıda'
  },
  {
    id: 5,
    name: 'Taze Somon Fileto 250g',
    price: 45.90,
    originalPrice: 52.90,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviews: 167,
    category: 'Et & Balık'
  },
  {
    id: 6,
    name: 'Organik Çilek 250g',
    price: 18.90,
    originalPrice: 22.90,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviews: 312,
    category: 'Meyve'
  },
  {
    id: 7,
    name: 'Artisan Ekmek',
    price: 8.50,
    originalPrice: 10.00,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    reviews: 89,
    category: 'Fırın'
  },
  {
    id: 8,
    name: 'Premium Çay Karışımı',
    price: 34.90,
    originalPrice: 39.90,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviews: 145,
    category: 'İçecek'
  }
];

export default function ProductGrid() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            En popüler ve kaliteli ürünlerimizi keşfedin
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
                  </div>
                )}
                
                {/* Quick Add Button */}
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <div className="text-xs text-primary-600 font-medium mb-2">
                  {product.category}
                </div>
                
                {/* Product Name */}
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors text-sm">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 transition-colors">
                    SEPETE EKLE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tüm Ürünleri Görüntüle
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}