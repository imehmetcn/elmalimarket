'use client';

import Link from 'next/link';
import { useState } from 'react';

// Ana kategoriler (ilk gösterilenler)
const mainCategories = [
  { name: 'Bebek Ürünleri', href: '/bebek-urunleri', icon: '👶' },
  { name: 'Bilgisayar, Cep Telefonu', href: '/bilgisayar-telefon', icon: '📱' },
  { name: 'Deterjan, Temizlik', href: '/deterjan-temizlik', icon: '🧽' },
  { name: 'Elektronik', href: '/elektronik', icon: '📺' },
  { name: 'Enerji İçecekleri', href: '/enerji-icecekleri', icon: '⚡' },
  { name: 'Et, Tavuk, Hindi', href: '/et-tavuk-hindi', icon: '🥩' },
  { name: 'Ev, Yaşam Ürünleri', href: '/ev-yasam', icon: '🏠' },
  { name: 'Evcil Hayvan Ürünleri', href: '/evcil-hayvan', icon: '🐕' },
];

// Tüm kategoriler (daha fazla göster'e basınca gösterilenler)
const allCategories = [
  ...mainCategories,
  { name: 'Meyve Sebze', href: '/meyve-sebze', icon: '🍎' },
  { name: 'Süt Ürünleri', href: '/sut-urunleri', icon: '🥛' },
  { name: 'Fırından Taze', href: '/firindan-taze', icon: '🍞' },
  { name: 'Temel Gıda', href: '/temel-gida', icon: '🌾' },
  { name: 'Atıştırmalık', href: '/atistirmalik', icon: '🍿' },
  { name: 'İçecek', href: '/icecek', icon: '🥤' },
  { name: 'Donuk', href: '/donuk', icon: '🧊' },
  { name: 'Kağıt Hijyen', href: '/kagit-hijyen', icon: '🧻' },
  { name: 'Kozmetik Kişisel Bakım', href: '/kozmetik', icon: '💄' },
];

export default function Navigation() {
  const [showAll, setShowAll] = useState(false);
  const categoriesToShow = showAll ? allCategories : mainCategories;

  return (
    <div className="nav-wrapper">
      <span>TÜM KATEGORİLER</span>
      <div id="navigation">
        <div className={`category-level-1 ${showAll ? 'active' : ''}`}>
          <ul>
            {categoriesToShow.map((category, index) => (
              <li key={index}>
                <Link href={category.href}>
                  <div style={{fontSize: '20px', textAlign: 'center'}}>
                    {category.icon}
                  </div>
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="category-overflow" onClick={() => setShowAll(!showAll)}>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}