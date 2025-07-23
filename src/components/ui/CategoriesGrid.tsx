'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { API_ROUTES, ROUTES } from '@/lib/constants';

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_ROUTES.CATEGORIES}?parentId=null`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.slice(0, 6)); // İlk 6 kategori
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kategoriler
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  // Kategori ikonları
  const categoryIcons: Record<string, JSX.Element> = {
    'Meyve & Sebze': (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    'Et & Tavuk': (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    'Süt Ürünleri': (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 2v6H3v14h18V8h-2V2H5zm2 2h10v4H7V4zm12 16H5V10h14v10z"/>
      </svg>
    ),
    'Fırın & Pastane': (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    ),
    'Temel Gıda': (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    ),
    'İçecekler': (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 3v18h2v-6h10v6h2V3H5zm2 2h10v8H7V5z"/>
      </svg>
    ),
  };

  const getDefaultIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kategoriler
          </h2>
          <p className="text-xl text-gray-600">
            İhtiyacınız olan her şey için kategorilerimizi keşfedin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={ROUTES.CATEGORY_PRODUCTS(category.id)}
              className="group bg-white rounded-lg p-6 text-center hover:shadow-medium transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <div className="text-primary-600">
                  {categoryIcons[category.name] || getDefaultIcon()}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={ROUTES.CATEGORIES}
            className="inline-block border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
          >
            Tüm Kategoriler
          </Link>
        </div>
      </div>
    </section>
  );
}