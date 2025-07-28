// Order utility functions

// Generate unique order tracking number
export function generateTrackingNumber(): string {
  const prefix = 'EM'; // Elmalı Market
  const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random chars
  return `${prefix}${timestamp}${random}`;
}

// Generate order reference number
export function generateOrderReference(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString().slice(2, 8); // 6 random digits
  return `${year}${month}${day}${random}`;
}

// Calculate estimated delivery date
export function calculateEstimatedDelivery(orderDate: Date, shippingMethod: string = 'standard'): Date {
  const deliveryDate = new Date(orderDate);
  
  switch (shippingMethod) {
    case 'express':
      deliveryDate.setDate(deliveryDate.getDate() + 1); // Next day
      break;
    case 'fast':
      deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days
      break;
    case 'standard':
    default:
      deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days
      break;
  }
  
  // Skip weekends
  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  
  return deliveryDate;
}

// Format order status for display
export function formatOrderStatus(status: string): { text: string; color: string } {
  const statusMap = {
    PENDING: { text: 'Beklemede', color: 'yellow' },
    CONFIRMED: { text: 'Onaylandı', color: 'blue' },
    PREPARING: { text: 'Hazırlanıyor', color: 'orange' },
    SHIPPED: { text: 'Kargoda', color: 'purple' },
    DELIVERED: { text: 'Teslim Edildi', color: 'green' },
    CANCELLED: { text: 'İptal Edildi', color: 'red' },
  };
  
  return statusMap[status as keyof typeof statusMap] || { text: status, color: 'gray' };
}

// Format payment status for display
export function formatPaymentStatus(status: string): { text: string; color: string } {
  const statusMap = {
    PENDING: { text: 'Beklemede', color: 'yellow' },
    PAID: { text: 'Ödendi', color: 'green' },
    FAILED: { text: 'Başarısız', color: 'red' },
  };
  
  return statusMap[status as keyof typeof statusMap] || { text: status, color: 'gray' };
}

// Validate order items before creation
export function validateOrderItems(items: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Sipariş öğeleri gerekli');
    return { isValid: false, errors };
  }
  
  for (const item of items) {
    if (!item.productId) {
      errors.push('Ürün ID gerekli');
    }
    
    if (!item.quantity || item.quantity <= 0) {
      errors.push('Geçerli bir miktar gerekli');
    }
    
    if (item.quantity > 100) {
      errors.push('Maksimum sipariş miktarı 100 adettir');
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Calculate shipping cost
export function calculateShippingCost(
  subtotal: number,
  city: string,
  shippingMethod: string = 'standard'
): number {
  // Free shipping over 200 TL
  if (subtotal >= 200) {
    return 0;
  }
  
  let baseCost = 15; // Standard shipping cost
  
  // City-based pricing
  const expensiveCities = ['İstanbul', 'Ankara', 'İzmir'];
  if (!expensiveCities.includes(city)) {
    baseCost += 5; // Additional cost for other cities
  }
  
  // Shipping method multiplier
  switch (shippingMethod) {
    case 'express':
      baseCost *= 2;
      break;
    case 'fast':
      baseCost *= 1.5;
      break;
    case 'standard':
    default:
      // No change
      break;
  }
  
  return baseCost;
}

// Generate order confirmation email data
export function generateOrderConfirmationData(order: any) {
  return {
    orderId: order.id,
    orderDate: order.createdAt,
    customerName: `${order.user?.firstName} ${order.user?.lastName}`,
    customerEmail: order.user?.email,
    items: order.items,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    estimatedDelivery: calculateEstimatedDelivery(new Date(order.createdAt)),
  };
}

// Order status progression
export const ORDER_STATUS_FLOW = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

// Check if status transition is valid
export function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  const allowedTransitions = ORDER_STATUS_FLOW[currentStatus as keyof typeof ORDER_STATUS_FLOW];
  return allowedTransitions?.includes(newStatus as any) || false;
}

// Generate order timeline
export function generateOrderTimeline(order: any) {
  const timeline = [
    {
      status: 'PENDING',
      title: 'Sipariş Alındı',
      description: 'Siparişiniz başarıyla alındı ve işleme konuldu',
      date: order.createdAt,
      completed: true,
    },
  ];
  
  if (order.status !== 'PENDING') {
    timeline.push({
      status: 'CONFIRMED',
      title: 'Sipariş Onaylandı',
      description: 'Siparişiniz onaylandı ve hazırlık aşamasına geçti',
      date: order.updatedAt,
      completed: ['CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(order.status),
    });
  }
  
  if (['PREPARING', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
    timeline.push({
      status: 'PREPARING',
      title: 'Hazırlanıyor',
      description: 'Siparişiniz hazırlanıyor ve paketleniyor',
      date: order.updatedAt,
      completed: ['PREPARING', 'SHIPPED', 'DELIVERED'].includes(order.status),
    });
  }
  
  if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
    timeline.push({
      status: 'SHIPPED',
      title: 'Kargoya Verildi',
      description: 'Siparişiniz kargoya verildi ve yola çıktı',
      date: order.updatedAt,
      completed: ['SHIPPED', 'DELIVERED'].includes(order.status),
    });
  }
  
  if (order.status === 'DELIVERED') {
    timeline.push({
      status: 'DELIVERED',
      title: 'Teslim Edildi',
      description: 'Siparişiniz başarıyla teslim edildi',
      date: order.updatedAt,
      completed: true,
    });
  }
  
  if (order.status === 'CANCELLED') {
    timeline.push({
      status: 'CANCELLED',
      title: 'İptal Edildi',
      description: 'Sipariş iptal edildi',
      date: order.updatedAt,
      completed: true,
    });
  }
  
  return timeline;
}