'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import SearchBox from '@/components/ui/SearchBox';
import CartDropdown from '@/components/cart/CartDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const categories = [
    { name: 'Meyve & Sebze', icon: '🥕', href: '/categories/1' },
    { name: 'Et & Tavuk', icon: '🥩', href: '/categories/2' },
    { name: 'Süt Ürünleri', icon: '🥛', href: '/categories/3' },
    { name: 'Fırın & Pastane', icon: '🍞', href: '/categories/4' },
    { name: 'Temel Gıda', icon: '🌾', href: '/categories/5' },
    { name: 'İçecekler', icon: '🥤', href: '/categories/6' },
  ];

  return (
    <>
      {/* Main Header - Modern & Professional */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Mobile Layout */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Left - Menu */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Center - Logo */}
              <div className="flex-1 flex justify-center">
                <Link href={ROUTES.HOME} className="flex items-center">
                  <img
                    src="/elmali-market-logo.png"
                    alt="Elmalı Market"
                    className="h-14 w-auto"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(17%) sepia(100%) saturate(7426%) hue-rotate(356deg) brightness(91%) contrast(135%)'
                    }}
                  />
                </Link>
              </div>

              {/* Right - Account */}
              <div className="flex flex-col items-center">
                {user ? (
                  <Link href={ROUTES.PROFILE} className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Hesabım</span>
                  </Link>
                ) : (
                  <Link href={ROUTES.LOGIN} className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Hesabım</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Left Side - Logo, Categories, Stores */}
            <div className="hidden md:flex items-center space-x-5">
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

              {/* Categories Button */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-lg mr-1">🛒</span>
                  <span>Kategoriler</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCategoriesOpen && (
                  <div
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border py-2 z-50"
                  >
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl mr-3">{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                    <hr className="my-2" />
                    <Link href={ROUTES.CATEGORIES} className="flex items-center px-4 py-3 text-primary-600 hover:bg-gray-50 font-medium">
                      <span className="mr-3">📂</span>
                      Tüm Kategoriler
                    </Link>
                  </div>
                )}
              </div>

              {/* Stores Link */}
              <Link href="/magazalar" className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors">
                Mağazalar
              </Link>
            </div>

            {/* Desktop Right Side - Login/Register */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900">Hoş geldin!</div>
                      <div className="text-xs text-gray-600">{user.firstName}</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <Link href={ROUTES.PROFILE} className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hesap Bilgilerim
                      </Link>
                      <Link href={ROUTES.ORDERS} className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Siparişlerim
                      </Link>
                      <hr className="my-2" />
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Güvenli Çıkış
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  {/* Desktop Version */}
                  <div className="hidden md:flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                    {/* User Icon */}
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    {/* Login/Register Text */}
                    <div className="flex flex-col">
                      <Link href={ROUTES.LOGIN} className="text-xs text-gray-500 font-medium hover:text-primary-600 transition-colors">
                        Giriş Yap
                      </Link>
                      <div className="flex items-center text-sm text-gray-800 font-semibold">
                        <span>veya</span>
                        <Link href={ROUTES.REGISTER} className="ml-1 text-primary-600 hover:text-primary-700">
                          Üye Ol
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Version */}
                  <div className="md:hidden">
                    <Link href={ROUTES.LOGIN} className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container-custom">
            <div className="py-2 px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Ürün, kategori veya marka ara..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:block bg-gray-50 border-t border-gray-100">
          <div className="container-custom">
            {/* Mobile Layout */}
            <div className="md:hidden flex items-center justify-between py-3 px-4">
              {/* Left - Delivery Info */}
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold">Gaziemir - Gazi Mah.</div>
                </div>
              </div>

              {/* Right - Region Change */}
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold">Bölge değiştir</div>
                </div>
              </div>
            </div>

            {/* Desktop Search Layout */}
            <div className="flex items-center justify-center py-3">
              {/* Left Side - Delivery Address */}
              <div className="flex items-center bg-white rounded-lg px-2 md:px-4 py-2 md:py-3 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                <div className="w-6 md:w-10 h-6 md:h-10 bg-primary-100 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-3 md:w-5 h-3 md:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium hidden md:block">Teslimat Adresi</div>
                  <button className="text-xs md:text-sm text-gray-800 hover:text-primary-600 font-semibold transition-colors">
                    Adres Seç
                  </button>
                </div>
              </div>

              {/* Center - Search Bar */}
              <div className="flex-1 max-w-2xl mx-2">
                <SearchBox />
              </div>

              {/* Right Side - Cart with Total - Hidden on mobile */}
              <div className="hidden md:flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group">
                {/* Red Circle with Cart Icon */}
                <div className="relative w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-2 md:mr-3 group-hover:bg-red-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  {/* Cart Badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-red-500">
                    <span className="text-xs text-red-500 font-bold">0</span>
                  </div>
                </div>

                {/* Cart Info - Hidden text on small mobile */}
                <div className="hidden sm:flex flex-col mr-2 md:mr-3">
                  <span className="text-xs text-gray-500 font-medium">Sepetim</span>
                  <span className="text-sm text-gray-800 font-semibold">0,00 TL</span>
                </div>

                {/* Mobile Cart Price - Only price on small screens */}
                <div className="sm:hidden flex items-center mr-2">
                  <span className="text-sm text-gray-800 font-semibold">0,00 TL</span>
                </div>

                {/* Arrow Icon */}
                <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Hidden CartDropdown for functionality */}
                <div className="absolute opacity-0 pointer-events-none">
                  <CartDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBox placeholder="Ürün ara..." />
            </div>

            <nav className="flex flex-col space-y-4">
              <Link
                href={ROUTES.HOME}
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href={ROUTES.PRODUCTS}
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ürünler
              </Link>
              <Link
                href={ROUTES.CATEGORIES}
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategoriler
              </Link>
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700">{user.firstName}</span>
                    </div>
                    <Link
                      href={ROUTES.PROFILE}
                      className="block text-gray-700 hover:text-primary-600 transition-colors mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profilim
                    </Link>
                    <Link
                      href={ROUTES.ORDERS}
                      className="block text-gray-700 hover:text-primary-600 transition-colors mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Siparişlerim
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href={ROUTES.ADMIN}
                        className="block text-gray-700 hover:text-primary-600 transition-colors mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={ROUTES.LOGIN}
                      className="block text-gray-700 hover:text-primary-600 transition-colors mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href={ROUTES.REGISTER}
                      className="block text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {/* Anasayfa */}
          <Link href={ROUTES.HOME} className="flex flex-col items-center py-2 px-3 text-center">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-xs text-orange-500 font-medium">Anasayfa</span>
          </Link>

          {/* Kategoriler */}
          <Link href={ROUTES.CATEGORIES} className="flex flex-col items-center py-2 px-3 text-center">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600 font-medium">Kategoriler</span>
          </Link>

          {/* Sepetim */}
          <Link href="/cart" className="flex flex-col items-center py-2 px-3 text-center">
            <div className="relative w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {/* Cart Badge */}
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">0</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Sepetim</span>
          </Link>

          {/* Kampanyalar */}
          <Link href="/campaigns" className="flex flex-col items-center py-2 px-3 text-center">
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