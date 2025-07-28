'use client';

import { useState, useEffect } from 'react';
import { OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/utils/orderNumber';
import TouchButton from '@/components/ui/TouchButton';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: OrderStatus, trackingNumber?: string, estimatedDelivery?: string, notes?: string) => Promise<void>;
  selectedCount: number;
}

export default function BulkOrderModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}: BulkOrderModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: 'CONFIRMED' as OrderStatus,
    trackingNumber: '',
    estimatedDelivery: '',
    notes: '',
  });

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: 'CONFIRMED' as OrderStatus,
        trackingNumber: '',
        estimatedDelivery: '',
        notes: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onConfirm(
        formData.status,
        formData.trackingNumber || undefined,
        formData.estimatedDelivery || undefined,
        formData.notes || undefined
      );
      onClose();
    } catch (error) {
      console.error('Bulk update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      PREPARING: '📦',
      SHIPPED: '🚚',
      DELIVERED: '✅',
      CANCELLED: '❌',
    };
    return icons[status] || '📋';
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Toplu Sipariş Güncelleme
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">Seçili sipariş sayısı:</span>
                <span className="font-medium text-blue-900">{selectedCount}</span>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Durum
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: status as OrderStatus }))}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.status === status
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getStatusIcon(status as OrderStatus)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{label}</div>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getStatusColor(status as OrderStatus)}`}>
                          {status}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Takip Numarası (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  placeholder="Kargo takip numarası"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahmini Teslimat Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar (Opsiyonel)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ek notlar veya açıklamalar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Bilgi</p>
                  <p className="text-sm text-yellow-700">
                    Seçili tüm siparişler aynı duruma güncellenecek ve müşterilere bildirim gönderilecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <TouchButton
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              İptal
            </TouchButton>
            <TouchButton
              variant="primary"
              onClick={handleSubmit}
              loading={isUpdating}
              disabled={isUpdating}
            >
              {selectedCount} Siparişi Güncelle
            </TouchButton>
          </div>
        </div>
      </div>
    </>
  );
}