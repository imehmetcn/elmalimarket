'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Görüşleriniz',
    subtitle: 'Bizim için Önemli!',
    description: 'Müşteri memnuniyeti önceliğimiz',
    buttonText: 'ANKETE KATIL',
    buttonLink: '/survey',
    bgColor: 'from-blue-500 to-blue-700',
    bgImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  }
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-8">
      <div className="container-custom">
        <section className="relative h-[300px] md:h-[400px] overflow-hidden rounded-2xl shadow-lg">
          <div className="relative h-full w-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl"
                  style={{ backgroundImage: `url(${slide.bgImage})` }}
                >
                  <div className="w-full h-full flex items-center justify-center text-center relative rounded-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} bg-opacity-85 rounded-2xl`}></div>

                    <div className="relative z-10 text-white space-y-6 max-w-2xl px-6">
                      <div className="flex justify-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">!</span>
                        </div>
                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">✓</span>
                        </div>
                        <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">?</span>
                        </div>
                      </div>

                      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        {slide.title}
                      </h1>

                      <h2 className="text-2xl md:text-4xl font-bold">
                        {slide.subtitle}
                      </h2>

                      <p className="text-lg opacity-90">
                        {slide.description}
                      </p>

                      <div className="pt-4">
                        <Link
                          href={slide.buttonLink}
                          className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HeroSlider;