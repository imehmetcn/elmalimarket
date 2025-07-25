'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { API_ROUTES, ROUTES } from '@/lib/constants';
import { formatPrice } from '@/utils/format';

interface SearchBoxProps {
  placeholder?: string;
}

export default function SearchBox({ placeholder = "Ürün, kategori veya marka ara..." }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_ROUTES.PRODUCTS}?search=${encodeURIComponent(query)}&limit=8`);
        const data = await response.json();
        
        if (data.success) {
          setResults(data.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Arama hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleProductClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  const popularSearches = [
    'Elma', 'Domates', 'Süt', 'Ekmek', 'Tavuk', 'Peynir'
  ];

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-l-lg focus:border-primary-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors flex items-center justify-center min-w-[60px]"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[500px] overflow-hidden">
          {results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-3 bg-gray-50 border-b">
                <h4 className="text-sm font-semibold text-gray-700">Ürünler</h4>
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={ROUTES.PRODUCT_DETAIL(product.id)}
                  onClick={handleProductClick}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {product.discountPrice ? (
                          <>
                            <span className="font-bold text-primary-600 mr-2">
                              {formatPrice(product.discountPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-primary-600">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Stokta
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                          Tükendi
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="p-4 bg-gray-50 border-t">
                <button
                  onClick={() => {
                    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2 rounded-lg hover:bg-white transition-colors"
                >
                  "{query}" için tüm sonuçları gör ({results.length}+)
                </button>
              </div>
            </div>
          ) : query.length >= 2 && !loading ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h4 className="font-medium text-gray-900 mb-2">Sonuç bulunamadı</h4>
              <p className="text-gray-500 mb-4">"{query}" için ürün bulunamadı</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Popüler aramalar:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(search)}`);
                        setIsOpen(false);
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : query.length === 0 ? (
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Popüler Aramalar</h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(search)}`);
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}