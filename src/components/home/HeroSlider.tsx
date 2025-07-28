'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/hero.css';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop&crop=center',
    link: '/products?category=fruits-vegetables'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&h=600&fit=crop&crop=center',
    link: '/products?category=meat'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=600&fit=crop&crop=center',
    link: '/products?category=dairy'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&crop=center',
    link: '/products?category=basic-food'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&crop=center',
    link: '/products?category=beverages'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!isClient) {
    return (
      <div className="relative h-64 md:h-[450px] lg:h-[550px] xl:h-[650px] rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${slides[0].image})`
          }}
        />
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <Link 
      href={currentSlideData.link}
      className="hero-slider block relative h-64 md:h-[450px] lg:h-[550px] xl:h-[650px] rounded-lg overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentSlideData.image})`
        }}
      />

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.preventDefault();
          prevSlide();
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/30 rounded-full text-white"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          nextSlide();
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/30 rounded-full text-white"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              goToSlide(index);
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Link>
  );
}