import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/payments/status/[orderId] - Get payment status
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // For guest orders, token might not be present
    let userId = null;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // Get order with payment status
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Check if user owns the order (for authenticated users)
    if (userId && order.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Bu siparişe erişim yetkiniz yok' },
        { status: 403 }
      );
    }

    // Determine payment status message
    let statusMessage = '';
    let nextAction = '';

    switch (order.paymentStatus) {
      case 'PENDING':
        statusMessage = 'Ödeme işlemi devam ediyor';
        nextAction = 'wait';
        break;
      case 'PAID':
        statusMessage = 'Ödeme başarıyla tamamlandı';
        nextAction = 'redirect_to_order';
        break;
      case 'FAILED':
        statusMessage = 'Ödeme işlemi başarısız oldu';
        nextAction = 'retry_payment';
        break;
      default:
        statusMessage = 'Ödeme durumu belirsiz';
        nextAction = 'contact_support';
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        statusMessage,
        nextAction,
        lastUpdated: order.updatedAt,
        customer: {
          name: `${order.user.firstName} ${order.user.lastName}`,
          email: order.user.email,
        },
      },
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Ödeme durumu sorgulanırken hata oluştu' },
      { status: 500 }
    );
  }
}