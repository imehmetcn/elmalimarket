'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import BulkOrderModal from '@/components/admin/BulkOrderModal';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/orderNumber';
import TouchButton from '@/components/ui/TouchButton';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [filters, pagination.page]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());
      
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string, 
    newStatus: OrderStatus, 
    trackingNumber?: string, 
    estimatedDelivery?: string, 
    notes?: string
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          trackingNumber,
          estimatedDelivery,
          notes,
        }),
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { 
            ...prev, 
            status: newStatus,
            trackingNumber: trackingNumber || prev.trackingNumber,
            estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : prev.estimatedDelivery,
            notes: notes || prev.notes,
          } : null);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Durum güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Status update error:', error);
      throw error;
    }
  };

  const handleBulkStatusUpdate = async (
    status: OrderStatus,
    trackingNumber?: string,
    estimatedDelivery?: string,
    notes?: string
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          status,
          trackingNumber,
          estimatedDelivery,
          notes,
        }),
      });

      if (response.ok) {
        setSelectedOrders([]);
        fetchOrders();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Toplu güncelleme sırasında hata oluştu');
      }
    } catch (error) {
      console.error('Bulk status update error:', error);
      throw error;
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length
        ? []
        : orders.map(order => order.id)
    );
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          <p className="text-gray-600">Tüm siparişleri görüntüleyin ve yönetin</p>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedOrders.length} sipariş seçildi
              </span>
              <div className="flex items-center space-x-2">
                <TouchButton
                  variant="primary"
                  size="sm"
                  onClick={() => setBulkModalOpen(true)}
                >
                  📋 Toplu Güncelle
                </TouchButton>
                <TouchButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                >
                  Seçimi Temizle
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arama
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Sipariş no, müşteri adı..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sipariş Durumu
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="PENDING">Beklemede</option>
                <option value="CONFIRMED">Onaylandı</option>
                <option value="PREPARING">Hazırlanıyor</option>
                <option value="SHIPPED">Kargoda</option>
                <option value="DELIVERED">Teslim Edildi</option>
                <option value="CANCELLED">İptal Edildi</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ödeme Durumu
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Ödemeler</option>
                <option value="PENDING">Beklemede</option>
                <option value="PAID">Ödendi</option>
                <option value="FAILED">Başarısız</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={toggleAllOrders}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sipariş No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sipariş Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Durumu
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber || `#${order.id.slice(-8)}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus === 'PENDING' && 'Beklemede'}
                          {order.paymentStatus === 'PAID' && 'Ödendi'}
                          {order.paymentStatus === 'FAILED' && 'Başarısız'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <TouchButton
                            variant="ghost"
                            size="sm"
                            onClick={() => openOrderModal(order)}
                          >
                            Detay
                          </TouchButton>
                          {order.status === 'PENDING' && (
                            <TouchButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                            >
                              ✅ Onayla
                            </TouchButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      Sipariş bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam {pagination.total} siparişten {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor
            </div>
            <div className="flex items-center space-x-2">
              <TouchButton
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Önceki
              </TouchButton>
              <span className="px-3 py-2 text-sm text-gray-700">
                {pagination.page} / {pagination.totalPages}
              </span>
              <TouchButton
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Sonraki
              </TouchButton>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={closeOrderModal}
          order={selectedOrder}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Bulk Order Modal */}
        <BulkOrderModal
          isOpen={bulkModalOpen}
          onClose={() => setBulkModalOpen(false)}
          onConfirm={handleBulkStatusUpdate}
          selectedCount={selectedOrders.length}
        />
      </div>
    </AdminLayout>
  );
}