'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { ROUTES } from '@/lib/constants';
import ProductCard from '@/components/product/ProductCard';
import SearchBox from '@/components/ui/SearchBox';

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchSearchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Sepet fonksiyonalitesi eklenecek
    console.log('Sepete eklendi:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Arama Sonuçları</h1>
          
          {/* Search Box */}
          <div className="max-w-2xl mb-6">
            <SearchBox placeholder="Yeni arama yapın..." />
          </div>

          {query && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Aranan:</span>
              <span className="font-medium text-gray-900">"{query}"</span>
              {!loading && (
                <span>({products.length} sonuç bulundu)</span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-soft overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                "{query}" için herhangi bir ürün bulunamadı. Farklı anahtar kelimeler deneyin.
              </p>
              
              {/* Suggestions */}
              <div className="max-w-md mx-auto">
                <h4 className="font-medium text-gray-900 mb-3">Öneriler:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Yazım hatası olup olmadığını kontrol edin</li>
                  <li>• Daha genel terimler kullanın</li>
                  <li>• Farklı anahtar kelimeler deneyin</li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Tüm Ürünleri Görüntüle
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Arama yapın
            </h3>
            <p className="text-gray-600 mb-6">
              Yukarıdaki arama kutusunu kullanarak ürün arayabilirsiniz.
            </p>
            <Link
              href={ROUTES.PRODUCTS}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tüm Ürünleri Görüntüle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}