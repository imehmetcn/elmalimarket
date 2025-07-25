'use client';

import { useState, useEffect } from 'react';

const reviews = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    rating: 5,
    comment: 'Ürünler çok taze ve kaliteli. Teslimat da çok hızlı oldu. Kesinlikle tavsiye ederim!',
    date: '2 gün önce',
    avatar: 'AY',
    verified: true
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    rating: 5,
    comment: 'Fiyatlar çok uygun ve müşteri hizmetleri harika. Sorunumu hemen çözdüler.',
    date: '1 hafta önce',
    avatar: 'MK',
    verified: true
  },
  {
    id: 3,
    name: 'Fatma Demir',
    rating: 4,
    comment: 'Genel olarak memnunum. Sadece bazı ürünlerin stokta olmaması üzücü.',
    date: '3 gün önce',
    avatar: 'FD',
    verified: false
  },
  {
    id: 4,
    name: 'Ali Özkan',
    rating: 5,
    comment: 'Mükemmel bir alışveriş deneyimi. Ürünler tam zamanında geldi ve çok taze.',
    date: '5 gün önce',
    avatar: 'AÖ',
    verified: true
  },
  {
    id: 5,
    name: 'Zeynep Arslan',
    rating: 5,
    comment: 'Elmalı Market sayesinde alışveriş çok kolay oldu. Mobil uygulaması da çok başarılı.',
    date: '1 gün önce',
    avatar: 'ZA',
    verified: true
  },
  {
    id: 6,
    name: 'Hasan Çelik',
    rating: 4,
    comment: 'Ürün çeşitliliği çok iyi. Fiyatlar da makul. Tavsiye ederim.',
    date: '4 gün önce',
    avatar: 'HÇ',
    verified: true
  }
];

export default function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Müşterilerimizin deneyimlerini okuyun
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({totalReviews} değerlendirme)
            </span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.slice(slideIndex * 3, (slideIndex + 1) * 3).map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            {review.verified && (
                              <div className="flex items-center text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs ml-1">Doğrulandı</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentReview ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Siz de Deneyiminizi Paylaşın
            </h3>
            <p className="text-gray-600 mb-6">
              Alışveriş deneyiminizi diğer müşterilerle paylaşın ve puanlayın
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Yorum Yap
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}