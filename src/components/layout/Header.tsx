'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Elmalı Market
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={ROUTES.HOME}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href={ROUTES.PRODUCTS}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Ürünler
            </Link>
            <Link
              href={ROUTES.CATEGORIES}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Kategoriler
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Cart Button */}
            <Link
              href={ROUTES.CART}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user.firstName}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-gray-200 py-2 z-50">
                      <Link
                        href={ROUTES.PROFILE}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profilim
                      </Link>
                      <Link
                        href={ROUTES.ORDERS}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Siparişlerim
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href={ROUTES.ADMIN}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Giriş
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href={ROUTES.REGISTER}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Kayıt
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
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
      </div>
    </header>
  );
}