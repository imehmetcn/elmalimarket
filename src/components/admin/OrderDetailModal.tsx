'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/orderNumber';
import TouchButton from '@/components/ui/TouchButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus, trackingNumber?: string, estimatedDelivery?: string, notes?: string) => Promise<void>;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onStatusUpdate,
}: OrderDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: '',
  });

  // Initialize form when order changes
  useEffect(() => {
    if (order) {
      setStatusForm({
        status: order.status,
        trackingNumber: order.trackingNumber || '',
        estimatedDelivery: order.estimatedDelivery 
          ? new Date(order.estimatedDelivery).toISOString().split('T')[0] 
          : '',
        notes: order.notes || '',
      });
    }
  }, [order]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleStatusUpdate = async () => {
    if (!order || statusForm.status === order.status) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(
        order.id,
        statusForm.status as OrderStatus,
        statusForm.trackingNumber || undefined,
        statusForm.estimatedDelivery || undefined,
        statusForm.notes || undefined
      );
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Ödeme Bekleniyor',
      PAID: 'Ödendi',
      FAILED: 'Ödeme Başarısız',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      credit_card: 'Kredi Kartı',
      bank_transfer: 'Banka Havalesi',
      cash_on_delivery: 'Kapıda Ödeme',
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Sipariş Detayı
              </h3>
              <p className="text-sm text-gray-600">
                {order.orderNumber || `#${order.id.slice(-8)}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Order Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Sipariş Bilgileri</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sipariş Tarihi:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toplam Tutar:</span>
                    <span className="font-semibold text-primary-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Yöntemi:</span>
                    <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Durumu:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Takip No:</span>
                      <span className="font-mono text-xs">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Müşteri Bilgileri</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ad Soyad:</span>
                    <span>{order.user?.firstName} {order.user?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-posta:</span>
                    <span className="break-all">{order.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefon:</span>
                    <span>{order.user?.phone || 'Belirtilmemiş'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Durum</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Sipariş Durumu:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Tahmini Teslimat:</span>
                      <span className="text-sm">{formatDate(order.estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Teslimat Adresi</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{order.shippingAddress.phone}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {order.shippingAddress.address}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.shippingAddress.district}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Sipariş Öğeleri</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adet</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-12 h-12">
                                <OptimizedImage
                                  src={item.product.images[0] || '/placeholder-product.jpg'}
                                  alt={item.product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {item.product.id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          Toplam Tutar:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-primary-600">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Durum Güncelle</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sipariş Durumu
                    </label>
                    <select
                      value={statusForm.status}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="PENDING">Beklemede</option>
                      <option value="CONFIRMED">Onaylandı</option>
                      <option value="PREPARING">Hazırlanıyor</option>
                      <option value="SHIPPED">Kargoya Verildi</option>
                      <option value="DELIVERED">Teslim Edildi</option>
                      <option value="CANCELLED">İptal Edildi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Takip Numarası
                    </label>
                    <input
                      type="text"
                      value={statusForm.trackingNumber}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Kargo takip numarası"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahmini Teslimat Tarihi
                    </label>
                    <input
                      type="date"
                      value={statusForm.estimatedDelivery}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notlar
                    </label>
                    <input
                      type="text"
                      value={statusForm.notes}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ek notlar"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notlar</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <TouchButton
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Kapat
            </TouchButton>
            <TouchButton
              variant="primary"
              onClick={handleStatusUpdate}
              loading={isUpdating}
              disabled={isUpdating || statusForm.status === order.status}
            >
              Durumu Güncelle
            </TouchButton>
          </div>
        </div>
      </div>
    </>
  );
}