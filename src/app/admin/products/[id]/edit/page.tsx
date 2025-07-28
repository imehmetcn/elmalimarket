'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { Product, Category } from '@/types';
import { useForm } from 'react-hook-form';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import TouchButton from '@/components/ui/TouchButton';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  images: FileList | null;
  isActive: boolean;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>();

  const watchImages = watch('images');

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    }
  }, [productId]);

  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const files = Array.from(watchImages);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);

      // Cleanup URLs on unmount
      return () => {
        previews.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreview([]);
    }
  }, [watchImages]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const productData = data.data;
        setProduct(productData);
        setExistingImages(productData.images || []);
        
        // Populate form with existing data
        reset({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          discountPrice: productData.discountPrice || undefined,
          stock: productData.stock,
          categoryId: productData.categoryId,
          isActive: productData.isActive,
        });
      } else {
        alert('Ürün bulunamadı');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Product fetch error:', error);
      alert('Ürün yüklenirken hata oluştu');
    } finally {
      setIsPageLoading(false);
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

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      if (data.discountPrice) {
        formData.append('discountPrice', data.discountPrice.toString());
      }
      formData.append('stock', data.stock.toString());
      formData.append('categoryId', data.categoryId);
      formData.append('isActive', data.isActive.toString());

      // Add new image files if any
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append(`images`, file);
        });
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Ürün başarıyla güncellendi!');
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ürün güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Product update error:', error);
      alert('Ürün güncellenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDeleteModal(false);
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ürün silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Product delete error:', error);
      alert('Ürün silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ürün Listesine Dön
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h1>
            <p className="text-gray-600">{product.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <TouchButton
              variant="danger"
              onClick={() => setDeleteModal(true)}
            >
              🗑️ Ürünü Sil
            </TouchButton>
            <TouchButton
              variant="outline"
              onClick={() => router.back()}
            >
              Geri Dön
            </TouchButton>
          </div>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ürün Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  {...register('name', { 
                    required: 'Ürün adı gerekli',
                    minLength: { value: 2, message: 'Ürün adı en az 2 karakter olmalı' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori *
                </label>
                <select
                  {...register('categoryId', { required: 'Kategori seçimi gerekli' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Miktarı *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('stock', { 
                    required: 'Stok miktarı gerekli',
                    min: { value: 0, message: 'Stok miktarı 0 veya daha büyük olmalı' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat (TL) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { 
                    required: 'Fiyat gerekli',
                    min: { value: 0.01, message: 'Fiyat 0.01 TL veya daha büyük olmalı' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İndirimli Fiyat (TL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('discountPrice', {
                    min: { value: 0.01, message: 'İndirimli fiyat 0.01 TL veya daha büyük olmalı' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.discountPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountPrice.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Açıklaması *
                </label>
                <textarea
                  rows={4}
                  {...register('description', { 
                    required: 'Ürün açıklaması gerekli',
                    minLength: { value: 10, message: 'Açıklama en az 10 karakter olmalı' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ürün Görselleri</h2>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Mevcut Görseller</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <ResponsiveImage
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yeni Görsel Yükle
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                {...register('images')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Yeni görseller mevcut görsellerin yerine geçecektir
              </p>
            </div>

            {/* New Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Yeni Görseller Önizleme</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ürün Durumu</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isActive')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Ürünü aktif olarak yayınla
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Aktif olmayan ürünler müşteriler tarafından görüntülenemez
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <TouchButton
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              İptal
            </TouchButton>
            <TouchButton
              variant="primary"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Değişiklikleri Kaydet
            </TouchButton>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDeleteProduct}
          title="Ürünü Sil"
          message="Bu ürünü silmek istediğinizden emin misiniz?"
          itemName={product?.name}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}