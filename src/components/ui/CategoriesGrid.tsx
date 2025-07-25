'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { API_ROUTES, ROUTES } from '@/lib/constants';
import { CategoryCardSkeleton } from '@/components/ui/LoadingSkeleton';

// Kategori görselleri - Gerçek ürün resimleri
const categoryData = [
  {
    name: 'Kampanyalar',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Meyve, Sebze',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Et, Tavuk, Hindi',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Süt, Kahvaltılık',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Dondurma',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Temel Gıda',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'İçecekler',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Atıştırmalık',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Sağlıklı Yaşam',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Deterjan, Temizlik',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Kişisel Bakım',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Kağıt Ürünleri',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Ev, Yaşam',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Bebek Ürünleri',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Evcil Hayvan',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

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
        setCategories(data.data.slice(0, 15)); // İlk 15 kategori
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-2 md:gap-3 mb-6">
            {[...Array(15)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-2xl mb-2 animate-pulse"></div>
                <div className="w-14 h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Kategoriler</h3>
            <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">Tüm Kategoriler</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-2 md:gap-3">
            {categoryData.map((categoryInfo, index) => {
              const category = categories[index];
              return (
                <Link
                  key={index}
                  href={category ? ROUTES.CATEGORY_PRODUCTS(category.id) : '/categories'}
                  className="group flex flex-col items-center hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-primary-100/30"></div>
                    
                    {/* Image */}
                    <img
                      src={categoryInfo.image}
                      alt={categoryInfo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                    
                    {/* Hover Icon */}
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 z-30">
                      <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-medium text-xs text-gray-900 group-hover:text-primary-600 transition-colors font-sans mb-1 max-w-[80px] leading-tight">
                      {categoryInfo.name}
                    </h4>
                    <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
}