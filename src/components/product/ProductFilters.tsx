'use client';

import { useState } from 'react';
import { cn } from '@/utils/format';
import { ProductFilters as IProductFilters, Category } from '@/types';

interface ProductFiltersProps {
    filters: IProductFilters;
    categories?: Category[];
    onFiltersChange: (filters: IProductFilters) => void;
    className?: string;
}

export default function ProductFilters({
    filters,
    categories,
    onFiltersChange,
    className,
}: ProductFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (key: keyof IProductFilters, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = Object.keys(filters).some(key =>
        filters[key as keyof IProductFilters] !== undefined
    );

    return (
        <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden p-4 border-b border-gray-200">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full text-left"
                >
                    <span className="font-medium">Filtreler</span>
                    <svg
                        className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')}
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
            </div>

            {/* Filter Content */}
            <div className={cn('p-4 space-y-6', !isOpen && 'hidden lg:block')}>
                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Filtreleri Temizle
                    </button>
                )}

                {/* Category Filter */}
                {categories && categories.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Kategori</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={!filters.categoryId}
                                    onChange={() => handleFilterChange('categoryId', undefined)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Tümü</span>
                            </label>
                            {categories.map((category) => (
                                <label key={category.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.categoryId === category.id}
                                        onChange={() => handleFilterChange('categoryId', category.id)}
                                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range Filter */}
                <div>
                    <h3 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Min Fiyat</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={filters.minPrice || ''}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Max Fiyat</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={filters.maxPrice || ''}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                placeholder="999.99"
                            />
                        </div>
                    </div>
                </div>

                {/* Stock Filter */}
                <div>
                    <h3 className="font-medium text-gray-900 mb-3">Stok Durumu</h3>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={filters.inStock || false}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Sadece stokta olanlar</span>
                    </label>
                </div>
            </div>
        </div>
    );
}