/**
 * Sipariş numarası oluşturma utility'leri
 */

/**
 * Benzersiz sipariş numarası oluşturur
 * Format: EM-YYYYMMDD-XXXXXX (EM: Elmalı Market, YYYY: Yıl, MM: Ay, DD: Gün, XXXXXX: Random)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // 6 haneli random sayı
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  
  return `EM-${year}${month}${day}-${randomPart}`;
}

/**
 * Sipariş takip numarası oluşturur
 * Format: TK-XXXXXXXXXX (10 haneli random)
 */
export function generateTrackingNumber(): string {
  const randomPart = Math.floor(1000000000 + Math.random() * 9000000000);
  return `TK-${randomPart}`;
}

/**
 * Sipariş numarasının geçerliliğini kontrol eder
 */
export function validateOrderNumber(orderNumber: string): boolean {
  const orderNumberRegex = /^EM-\d{8}-\d{6}$/;
  return orderNumberRegex.test(orderNumber);
}

/**
 * Takip numarasının geçerliliğini kontrol eder
 */
export function validateTrackingNumber(trackingNumber: string): boolean {
  const trackingNumberRegex = /^TK-\d{10}$/;
  return trackingNumberRegex.test(trackingNumber);
}

/**
 * Sipariş numarasından tarih bilgisini çıkarır
 */
export function extractDateFromOrderNumber(orderNumber: string): Date | null {
  if (!validateOrderNumber(orderNumber)) {
    return null;
  }
  
  const datePart = orderNumber.split('-')[1];
  const year = parseInt(datePart.substring(0, 4));
  const month = parseInt(datePart.substring(4, 6)) - 1; // JavaScript months are 0-indexed
  const day = parseInt(datePart.substring(6, 8));
  
  return new Date(year, month, day);
}

/**
 * Sipariş durumu için Türkçe açıklamalar
 */
export const ORDER_STATUS_LABELS = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandı',
  PREPARING: 'Hazırlanıyor',
  SHIPPED: 'Kargoya Verildi',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'İptal Edildi',
} as const;

/**
 * Ödeme durumu için Türkçe açıklamalar
 */
export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Ödeme Bekleniyor',
  PAID: 'Ödendi',
  FAILED: 'Ödeme Başarısız',
} as const;

/**
 * Sipariş durumu için renk kodları
 */
export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
} as const;

/**
 * Ödeme durumu için renk kodları
 */
export const PAYMENT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
} as const;