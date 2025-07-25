'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function SimpleHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // Gerçek uygulamada context'ten gelecek
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Top Header - Logo, Navigation & User Info */}
      <div className="bg-transparent">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2">
            {/* Left Side - Logo & Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href={ROUTES.HOME} className="flex items-center hover:opacity-90 transition-opacity">
                <img
                  src="/elmali-market-logo.png"
                  alt="Elmalı Market"
                  className="h-20 w-auto"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(17%) sepia(100%) saturate(7426%) hue-rotate(356deg) brightness(91%) contrast(135%)'
                  }}
                />
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href={ROUTES.CATEGORIES} className="text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100" style={{ fontSize: '.875rem', fontWeight: 600 }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                  </svg>
                  <span>Kategoriler</span>
                </Link>
                <Link href="/stores" className="text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100" style={{ fontSize: '.875rem', fontWeight: 300 }}>
                  Online Satış Kanalı
                </Link>
                <Link href="/campaigns" className="text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100" style={{ fontSize: '.875rem', fontWeight: 300 }}>
                  Mağazalar
                </Link>
                <Link href="/support" className="text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100" style={{ fontSize: '.875rem', fontWeight: 300 }}>
                  Kurumsal
                </Link>
              </div>
            </div>

            {/* Right Side - User Account */}
            <div className="flex items-center space-x-4">
              {/* User Account */}
              {user ? (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <div className="text-sm">
                    <div className="text-gray-600">Giriş Yap</div>
                    <div className="font-medium text-gray-800">{user.firstName}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <div className="text-sm">
                    <Link href={ROUTES.LOGIN} className="text-gray-600 hover:text-blue-600 transition-colors">
                      Giriş Yap
                    </Link>
                    <div className="font-medium text-gray-800">veya Üye Ol</div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="bg-gray-50 border-t border-gray-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2">
            {/* Left Side - Address Selection */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div className="text-sm">
                <div className="text-gray-600">Teslimat Adresi</div>
                <button className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                  Adres Seç 16:30 - 18:30
                </button>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex items-center space-x-2 w-[500px]">
              <input
                type="text"
                placeholder="Ürün ara..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors whitespace-nowrap">
                Ara
              </button>
            </div>

            {/* Right Side - Cart */}
            <Link href="/cart" className="relative bg-transparent text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 border border-gray-300">
              <div className="relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{cartItemCount}</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Sepetim</div>
                <div className="text-xs opacity-70">0,00 TL</div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden bg-white border-t border-gray-100">
        <div className="container-custom py-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ürün ara..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors whitespace-nowrap">
              Ara
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 rounded-b-lg">
          <div className="container-custom py-4 space-y-4">
            <Link href={ROUTES.CATEGORIES} className="block text-gray-700 hover:text-orange-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Kategoriler
            </Link>
            <Link href="/stores" className="block text-gray-700 hover:text-orange-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Online Satış Kanalı
            </Link>
            <Link href="/campaigns" className="block text-gray-700 hover:text-orange-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Mağazalar
            </Link>
            <Link href="/support" className="block text-gray-700 hover:text-orange-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Kurumsal
            </Link>
            {!user && (
              <>
                <Link href={ROUTES.LOGIN} className="block text-gray-700 hover:text-orange-600 font-medium">
                  Giriş Yap
                </Link>
                <Link href={ROUTES.REGISTER} className="block text-gray-700 hover:text-orange-600 font-medium">
                  Üye Ol
                </Link>
              </>
            )}
            {user && (
              <>
                <Link href={ROUTES.PROFILE} className="block text-gray-700 hover:text-orange-600 font-medium">
                  Hesabım
                </Link>
                <button onClick={handleLogout} className="block text-gray-700 hover:text-red-600 font-medium">
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {/* Anasayfa */}
          <Link href={ROUTES.HOME} className="flex flex-col items-center py-2 px-3 text-center rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-xs text-red-500 font-medium">Anasayfa</span>
          </Link>

          {/* Kategoriler */}
          <Link href={ROUTES.CATEGORIES} className="flex flex-col items-center py-2 px-3 text-center rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600 font-medium">Kategoriler</span>
          </Link>

          {/* Sepetim */}
          <Link href="/cart" className="flex flex-col items-center py-2 px-3 text-center rounded-lg hover:bg-gray-100 transition-colors">
            <div className="relative w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">0</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Sepetim</span>
          </Link>

          {/* Kampanyalar */}
          <Link href="/campaigns" className="flex flex-col items-center py-2 px-3 text-center rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <span className="text-xs text-gray-600 font-medium">Kampanyalar</span>
          </Link>
        </div>
      </div>
    </>
  );
}