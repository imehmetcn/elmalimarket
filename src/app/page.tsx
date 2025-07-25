'use client';

import { useState, useEffect, useRef } from 'react';
import CategoriesGrid from '@/components/ui/CategoriesGrid';

// Hero Slider Component
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      alt: 'Elmalı Market - Taze Meyve ve Sebzeler'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Elmalı Market - Günlük Taze Ürünler'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Elmalı Market - Kaliteli Gıda Ürünleri'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      alt: 'Elmalı Market - Organik Ürünler'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        <div>
          <section className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-lg">
            <div className="relative h-full w-full">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

// Et, Balık, Tavuk Section Component
function MeatFishChickenSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    {
      id: 1,
      title: 'Et Ürünleri',
      products: [
        { id: 1, name: 'Dana Kuşbaşı', price: '89,90 TL', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop' },
        { id: 2, name: 'Kuzu Pirzola', price: '129,90 TL', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
        { id: 3, name: 'Dana Kıyma', price: '79,90 TL', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop' },
        { id: 4, name: 'Biftek', price: '149,90 TL', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop' },
        { id: 5, name: 'Kuzu Kol', price: '119,90 TL', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop' }
      ]
    },
    {
      id: 2,
      title: 'Balık Ürünleri',
      products: [
        { id: 6, name: 'Çupra', price: '45,90 TL', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop' },
        { id: 7, name: 'Levrek', price: '52,90 TL', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop' },
        { id: 8, name: 'Somon', price: '89,90 TL', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop' },
        { id: 9, name: 'Hamsi', price: '25,90 TL', image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop' },
        { id: 10, name: 'Palamut', price: '35,90 TL', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=400&fit=crop' }
      ]
    },
    {
      id: 3,
      title: 'Tavuk Ürünleri',
      products: [
        { id: 11, name: 'Tavuk But', price: '32,90 TL', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop' },
        { id: 12, name: 'Tavuk Göğsü', price: '39,90 TL', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop' },
        { id: 13, name: 'Tavuk Kanat', price: '28,90 TL', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop' },
        { id: 14, name: 'Bütün Tavuk', price: '45,90 TL', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=400&fit=crop' },
        { id: 15, name: 'Tavuk Bonfile', price: '42,90 TL', image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&h=400&fit=crop' }
      ]
    }
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-800">Et, Balık, Tavuk Ürünleri</h3>
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">Et, Balık, Tavuk</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.flatMap(category => category.products).slice(0, 6).map((product, index) => {
              const isDiscounted = index < 6;
              const originalPrice = parseFloat(product.price.replace(' TL', '').replace(',', '.'));

              return (
                <div key={product.id} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="mb-4 rounded-xl p-4 flex items-center justify-center min-h-[192px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 h-12 flex items-center justify-center leading-tight">
                      {product.name}
                    </h4>

                    <div className="mb-6 flex items-center justify-center space-x-3">
                      {isDiscounted ? (
                        <>
                          <span className="text-2xl font-bold text-red-500">
                            ₺{originalPrice.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₺{(originalPrice * 1.5).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">
                          ₺{originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white text-base py-4 px-6 rounded-xl flex items-center justify-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                      </svg>
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <CategoriesGrid />
      <MeatFishChickenSection />
      <FruitVegetableSection />
      <DairySection />
    </div>
  );
}

// Meyve & Sebze Section Component
function FruitVegetableSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const products = [
    { id: 1, name: 'Elma Golden', price: '12,90', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop' },
    { id: 2, name: 'Muz', price: '18,50', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop' },
    { id: 3, name: 'Portakal', price: '15,90', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop' },
    { id: 4, name: 'Domates', price: '8,90', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop' },
    { id: 5, name: 'Salatalık', price: '6,50', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop' },
    { id: 6, name: 'Biber Dolmalık', price: '22,90', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop' }
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-800">Meyve & Sebze</h3>
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">Meyve & Sebze</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.slice(0, 6).map((product, index) => {
              const isDiscounted = index < 6;
              const originalPrice = parseFloat(product.price.replace(',', '.'));

              return (
                <div key={product.id} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="mb-4 rounded-xl p-4 flex items-center justify-center min-h-[192px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 h-12 flex items-center justify-center leading-tight">
                      {product.name}
                    </h4>

                    <div className="mb-6 flex items-center justify-center space-x-3">
                      {isDiscounted ? (
                        <>
                          <span className="text-2xl font-bold text-green-600">
                            ₺{originalPrice.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₺{(originalPrice * 1.8).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">
                          ₺{originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-green-500 hover:bg-green-600 text-white text-base py-4 px-6 rounded-xl flex items-center justify-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                      </svg>
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Süt & Süt Ürünleri Section Component
function DairySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const products = [
    { id: 1, name: 'Tam Yağlı Süt', price: '8,50', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop' },
    { id: 2, name: 'Beyaz Peynir', price: '45,90', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop' },
    { id: 3, name: 'Yoğurt', price: '12,90', image: 'https://images.unsplash.com/photo-1571212515416-fca0bf4c0b5e?w=400&h=400&fit=crop' },
    { id: 4, name: 'Tereyağı', price: '28,90', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop' },
    { id: 5, name: 'Kaşar Peyniri', price: '65,90', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=400&fit=crop' },
    { id: 6, name: 'Ayran', price: '4,50', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=400&fit=crop' }
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-800">Süt & Süt Ürünleri</h3>
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">Süt & Süt Ürünleri</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.slice(0, 6).map((product, index) => {
              const isDiscounted = index < 6;
              const originalPrice = parseFloat(product.price.replace(',', '.'));

              return (
                <div key={product.id} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="mb-4 rounded-xl p-4 flex items-center justify-center min-h-[192px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 h-12 flex items-center justify-center leading-tight">
                      {product.name}
                    </h4>

                    <div className="mb-6 flex items-center justify-center space-x-3">
                      {isDiscounted ? (
                        <>
                          <span className="text-2xl font-bold text-blue-600">
                            ₺{originalPrice.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₺{(originalPrice * 1.3).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">
                          ₺{originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-base py-4 px-6 rounded-xl flex items-center justify-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                      </svg>
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}