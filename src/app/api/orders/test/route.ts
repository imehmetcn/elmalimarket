import { NextRequest, NextResponse } from 'next/server';
import { generateOrderTrackingNumber, getOrderStatusText, calculateOrderSummary } from '@/utils/orderUtils';
import { OrderStatus } from '@/types';

// GET /api/orders/test - Sipariş utility fonksiyonlarını test et
export async function GET(request: NextRequest) {
  try {
    // Test data
    const testItems = [
      { quantity: 2, price: 25.90, totalPrice: 51.80 },
      { quantity: 1, price: 15.50, totalPrice: 15.50 },
      { quantity: 3, price: 8.75, totalPrice: 26.25 },
    ];

    const testResults = {
      trackingNumber: generateOrderTrackingNumber(),
      statusTexts: {
        pending: getOrderStatusText(OrderStatus.PENDING),
        confirmed: getOrderStatusText(OrderStatus.CONFIRMED),
        preparing: getOrderStatusText(OrderStatus.PREPARING),
        shipped: getOrderStatusText(OrderStatus.SHIPPED),
        delivered: getOrderStatusText(OrderStatus.DELIVERED),
        cancelled: getOrderStatusText(OrderStatus.CANCELLED),
      },
      orderSummary: calculateOrderSummary(testItems),
    };

    return NextResponse.json({
      success: true,
      data: testResults,
      message: 'Sipariş utility fonksiyonları test edildi',
    });
  } catch (error) {
    console.error('Order test error:', error);
    return NextResponse.json(
      { success: false, error: 'Test başarısız' },
      { status: 500 }
    );
  }
}