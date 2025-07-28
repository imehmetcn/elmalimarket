'use client';

import Link from 'next/link';
import '@/styles/categories.css';

const categories = [
  {
    id: 1,
    name: 'Güncel Katalog',
    href: '/guncel-katalog',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'Katalog Ürünleri',
    href: '/guncel-katalog-urunleri',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 3,
    name: 'Kampanyalar',
    href: '/kampanyalar',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 4,
    name: 'Mağazalar',
    href: '/magazalar',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 5,
    name: 'Meyve, Sebze',
    href: '/meyve-sebze',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 6,
    name: 'Et, Tavuk, Hindi',
    href: '/et-tavuk-balik',
    image: 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 7,
    name: 'Süt, Kahvaltılık',
    href: '/sut-kahvaltilik',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 8,
    name: 'Dondurma',
    href: '/dondurma',
    image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 9,
    name: 'Temel Gıda',
    href: '/temel-gida',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 10,
    name: 'İçecekler',
    href: '/icecekler',
    image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 11,
    name: 'Atıştırmalık',
    href: '/atistirmalik',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 12,
    name: 'Sağlıklı Yaşam',
    href: '/saglikli-yasam-urunleri',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 13,
    name: 'Deterjan, Temizlik',
    href: '/deterjan-temizlik',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 14,
    name: 'Kişisel Bakım',
    href: '/kisisel-bakim-kozmetik',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 15,
    name: 'Kağıt Ürünleri',
    href: '/kagit-urunleri',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 16,
    name: 'Ev, Yaşam',
    href: '/ev-ve-yasam',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 17,
    name: 'Bebek Ürünleri',
    href: '/bebek-urunleri',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 18,
    name: 'Evcil Hayvan',
    href: '/evcil-hayvan',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=center'
  }
];

export default function Categories() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-5 md:grid-cols-9 gap-4">
        {categories.slice(0, 9).map((category, index) => (
          <Link key={category.id} href={category.href} className="flex flex-col items-center group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-3 relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-colors duration-300" />
              
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Floating Badge */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
            </div>
            <span className="text-xs text-center text-gray-700 leading-tight font-medium group-hover:text-blue-600 transition-colors duration-200">
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-4 md:grid-cols-9 gap-4 mt-6">
        {categories.slice(9, 18).map((category, index) => (
          <Link key={category.id} href={category.href} className="flex flex-col items-center group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-3 relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-400 transition-colors duration-300" />
              
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Floating Badge */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                <span className="text-white text-xs font-bold">{index + 10}</span>
              </div>
            </div>
            <span className="text-xs text-center text-gray-700 leading-tight font-medium group-hover:text-green-600 transition-colors duration-200">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}