'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MobileMenu from './MobileMenu';
import MobileCartDrawer from '@/components/cart/MobileCartDrawer';
import SearchBox from '@/components/ui/SearchBox';
import TouchButton from '@/components/ui/TouchButton';

export default function ResponsiveHeader() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 lg:hidden">
            {/* Mobile Menu Button */}
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2"
              aria-label="Menüyü aç"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </TouchButton>

            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-lg font-bold text-primary-600">🍎 Elmalı Market</h1>
            </Link>

            {/* Mobile Cart Button */}
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileCartOpen(true)}
              className="relative p-2"
              aria-label="Sepeti aç"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </TouchButton>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-16">
            {/* Desktop Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">🍎 Elmalı Market</h1>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBox />
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {user.firstName}
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <TouchButton variant="ghost" size="sm" className="p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </TouchButton>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profilim
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Siparişlerim
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <TouchButton variant="ghost" size="sm">
                      Giriş Yap
                    </TouchButton>
                  </Link>
                  <Link href="/auth/register">
                    <TouchButton variant="primary" size="sm">
                      Kayıt Ol
                    </TouchButton>
                  </Link>
                </div>
              )}

              {/* Desktop Cart */}
              <Link href="/cart">
                <TouchButton variant="ghost" size="sm" className="relative p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </TouchButton>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <SearchBox />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Cart Drawer */}
      <MobileCartDrawer
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
      />
    </>
  );
}