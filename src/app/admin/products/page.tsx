'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import BulkActionModal from '@/components/admin/BulkActionModal';
import { Product, Category } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import TouchButton from '@/components/ui/TouchButton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    stock: '',
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId?: string;
    productName?: string;
  }>({ isOpen: false });
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    action?: 'activate' | 'deactivate' | 'delete';
  }>({ isOpen: false });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('categoryId', filters.category);
      if (filters.status) params.set('isActive', filters.status);
      if (filters.stock === 'low') params.set('lowStock', 'true');
      if (filters.stock === 'out') params.set('outOfStock', 'true');

      const response = await fetch(`/api/products?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Products fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Categories fetch error:', error);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedProducts.length === 0) return;
    setBulkActionModal({ isOpen: true, action });
  };

  const confirmBulkAction = async () => {
    if (!bulkActionModal.action) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const promises = selectedProducts.map(productId => {
        if (bulkActionModal.action === 'delete') {
          return fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          return fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isActive: bulkActionModal.action === 'activate',
            }),
          });
        }
      });

      await Promise.all(promises);
      setSelectedProducts([]);
      setBulkActionModal({ isOpen: false });
      fetchProducts();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('İşlem sırasında hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    setDeleteModal({ isOpen: true, productId, productName });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteModal.productId) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${deleteModal.productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDeleteModal({ isOpen: false });
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ürün silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Product delete error:', error);
      alert('Ürün silinirken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? []
        : products.map(p => p.id)
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
            <p className="text-gray-600">Ürünlerinizi yönetin ve düzenleyin</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Yeni Ürün Ekle
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arama
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Ürün adı ara..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok Durumu
              </label>
              <select
                value={filters.stock}
                onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Stoklar</option>
                <option value="low">Düşük Stok</option>
                <option value="out">Stokta Yok</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedProducts.length} ürün seçildi
              </span>
              <div className="flex items-center space-x-2">
                <TouchButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  ✅ Aktif Yap
                </TouchButton>
                <TouchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  ⏸️ Pasif Yap
                </TouchButton>
                <TouchButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  🗑️ Sil
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={toggleAllProducts}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <ResponsiveImage
                              src={product.images[0] || '/images/placeholder-product.svg'}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category?.name || 'Kategori Yok'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {product.discountPrice ? (
                            <>
                              <span className="font-medium">{formatPrice(product.discountPrice)}</span>
                              <span className="ml-2 text-gray-500 line-through text-xs">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : product.stock <= 10
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.stock} adet
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-primary-600 hover:text-primary-900 font-medium"
                          >
                            Düzenle
                          </Link>
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Görüntüle
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      Ürün bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={confirmDeleteProduct}
          title="Ürünü Sil"
          message="Bu ürünü silmek istediğinizden emin misiniz?"
          itemName={deleteModal.productName}
          isLoading={actionLoading}
        />

        {/* Bulk Action Modal */}
        <BulkActionModal
          isOpen={bulkActionModal.isOpen}
          onClose={() => setBulkActionModal({ isOpen: false })}
          onConfirm={confirmBulkAction}
          action={bulkActionModal.action!}
          selectedCount={selectedProducts.length}
          isLoading={actionLoading}
        />
      </div>
    </AdminLayout>
  );
}