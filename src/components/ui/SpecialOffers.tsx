'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const offers = [
    {
        id: 1,
        title: 'Süper Fırsat',
        description: 'Tüm meyve ve sebzelerde',
        discount: '%30',
        validUntil: '31 Temmuz',
        bgColor: 'from-red-500 to-pink-600',
        icon: '🍎'
    },
    {
        id: 2,
        title: 'Haftanın Kampanyası',
        description: 'Et ürünlerinde büyük indirim',
        discount: '%25',
        validUntil: '28 Temmuz',
        bgColor: 'from-orange-500 to-red-500',
        icon: '🥩'
    },
    {
        id: 3,
        title: 'Süt Ürünleri',
        description: 'Taze süt ürünlerinde',
        discount: '%20',
        validUntil: '30 Temmuz',
        bgColor: 'from-blue-500 to-indigo-600',
        icon: '🥛'
    }
];

export default function SpecialOffers() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 45,
        seconds: 30
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Özel Fırsatlar
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Sınırlı süre için geçerli özel indirimlerden yararlanın
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <div className="text-center">
                            <div className="bg-red-500 text-white rounded-lg p-3 min-w-[60px]">
                                <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Saat</div>
                        </div>
                        <div className="text-2xl text-gray-400">:</div>
                        <div className="text-center">
                            <div className="bg-red-500 text-white rounded-lg p-3 min-w-[60px]">
                                <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Dakika</div>
                        </div>
                        <div className="text-2xl text-gray-400">:</div>
                        <div className="text-center">
                            <div className="bg-red-500 text-white rounded-lg p-3 min-w-[60px]">
                                <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Saniye</div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${offer.bgColor} p-6 text-white group hover:scale-105 transition-transform duration-300`}
                        >
                            <div className="absolute top-4 right-4 text-4xl opacity-20">
                                {offer.icon}
                            </div>

                            <div className="relative z-10">
                                <div className="text-5xl font-bold mb-2">{offer.discount}</div>
                                <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                                <p className="text-white/90 mb-4">{offer.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="opacity-75">Son tarih: </span>
                                        <span className="font-semibold">{offer.validUntil}</span>
                                    </div>

                                    <Link
                                        href={ROUTES.PRODUCTS}
                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                                    >
                                        Alışveriş Yap
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}