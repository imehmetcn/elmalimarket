'use client';

import { useEffect } from 'react';
import TouchButton from '@/components/ui/TouchButton';

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'activate' | 'deactivate' | 'delete';
  selectedCount: number;
  isLoading?: boolean;
}

export default function BulkActionModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  selectedCount,
  isLoading = false,
}: BulkActionModalProps) {
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

  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'activate':
        return {
          title: 'Ürünleri Aktif Yap',
          message: `Seçili ${selectedCount} ürünü aktif hale getirmek istediğinizden emin misiniz?`,
          description: 'Aktif edilen ürünler müşteriler tarafından görüntülenebilir ve satın alınabilir.',
          icon: (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          confirmText: 'Aktif Yap',
          confirmVariant: 'primary' as const,
          bgColor: 'bg-green-100',
        };
      case 'deactivate':
        return {
          title: 'Ürünleri Pasif Yap',
          message: `Seçili ${selectedCount} ürünü pasif hale getirmek istediğinizden emin misiniz?`,
          description: 'Pasif edilen ürünler müşteriler tarafından görüntülenemez.',
          icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          confirmText: 'Pasif Yap',
          confirmVariant: 'secondary' as const,
          bgColor: 'bg-yellow-100',
        };
      case 'delete':
        return {
          title: 'Ürünleri Sil',
          message: `Seçili ${selectedCount} ürünü silmek istediğinizden emin misiniz?`,
          description: 'Bu işlem geri alınamaz. Silinen ürünler kalıcı olarak kaybolacaktır.',
          icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          confirmText: 'Sil',
          confirmVariant: 'danger' as const,
          bgColor: 'bg-red-100',
        };
    }
  };

  const config = getActionConfig();

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
              <div className={`flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}>
                {config.icon}
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                {config.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              {config.message}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Seçili ürün sayısı:</span>
                <span className="font-medium text-gray-900">{selectedCount}</span>
              </div>
            </div>

            <div className={`${config.bgColor} border ${
              action === 'delete' ? 'border-red-200' : 
              action === 'activate' ? 'border-green-200' : 'border-yellow-200'
            } rounded-lg p-3`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-2">
                  {config.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    action === 'delete' ? 'text-red-800' : 
                    action === 'activate' ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {action === 'delete' ? 'Dikkat!' : 'Bilgi'}
                  </p>
                  <p className={`text-sm ${
                    action === 'delete' ? 'text-red-700' : 
                    action === 'activate' ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {config.description}
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
              disabled={isLoading}
            >
              İptal
            </TouchButton>
            <TouchButton
              variant={config.confirmVariant}
              onClick={onConfirm}
              loading={isLoading}
              disabled={isLoading}
            >
              {config.confirmText}
            </TouchButton>
          </div>
        </div>
      </div>
    </>
  );
}