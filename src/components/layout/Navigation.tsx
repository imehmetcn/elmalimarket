'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { id: '1', name: 'Meyve & Sebze', href: '/products?category=fruits-vegetables', icon: '🍎' },
  { id: '2', name: 'Et & Tavuk', href: '/products?category=meat-poultry', icon: '🥩' },
  { id: '3', name: 'Süt Ürünleri', href: '/products?category=dairy', icon: '🥛' },
  { id: '4', name: 'Fırın & Pastane', href: '/products?category=bakery', icon: '🍞' },
  { id: '5', name: 'Dondurulmuş', href: '/products?category=frozen', icon: '🧊' },
  { id: '6', name: 'İçecekler', href: '/products?category=beverages', icon: '🥤' },
  { id: '7', name: 'Atıştırmalık', href: '/products?category=snacks', icon: '🍿' },
  { id: '8', name: 'Temizlik', href: '/products?category=cleaning', icon: '🧽' },
];

const mainNavItems = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Ürünler', href: '/products' },
  { name: 'Kampanyalar', href: '/campaigns' },
  { name: 'Hakkımızda', href: '/about' },
  { name: 'İletişim', href: '/contact' },
];

export default function Navigation() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center space-x-2 bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">Kategoriler</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Categories Dropdown Menu */}
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={category.href}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 font-medium"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    Tüm Kategoriler →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-primary-200 transition-colors duration-200 border-b-2 border-transparent hover:border-primary-200 pb-1"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Info */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>0850 123 45 67</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>7/24 Hizmet</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Ücretsiz Kargo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="md:hidden border-t border-primary-700">
        <div className="px-4 py-2 space-y-1">
          {mainNavItems.slice(1).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 text-sm font-medium hover:text-primary-200 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}