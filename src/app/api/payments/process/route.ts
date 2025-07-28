import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { PayTRService } from '@/lib/paytrService';
import { PaymentService, PaymentRequest } from '@/lib/paymentService';

// POST /api/payments/process - Process payment
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const body = await request.json();
    const { orderId, paymentMethod, cardInfo } = body;

    // For guest orders, token might not be present
    let userId = null;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        shippingAddress: true,
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

    // Check if order is already paid
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'Bu sipariş zaten ödenmiş' },
        { status: 400 }
      );
    }

    // Get order items for PayTR
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      include: {
        product: {
          select: {
            name: true,
            categoryId: true,
          },
        },
      },
    });

    // Initialize PayTR service
    const paytrService = new PayTRService();

    // Prepare PayTR payment request
    const paytrRequest = {
      orderId: order.orderNumber || order.id,
      amount: paytrService.tlToKurus(order.totalAmount), // Convert to kuruş
      currency: 'TL',
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      customerEmail: order.user.email,
      customerPhone: order.user.phone || '',
      customerAddress: order.shippingAddress ? 
        `${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.city}` : 
        'Adres bilgisi yok',
      basketItems: orderItems.map(item => ({
        name: item.product.name,
        category: 'Genel',
        quantity: item.quantity,
        price: paytrService.tlToKurus(item.price), // Convert to kuruş
      })),
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${order.id}`,
      failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?orderId=${order.id}`,
      timeoutLimit: 30, // 30 minutes
      installmentCount: cardInfo?.installments || 1,
    };

    // Create PayTR payment
    const paymentResult = await paytrService.createPayment(paytrRequest);

    if (paymentResult.success && paymentResult.paymentUrl) {
      // Update order to indicate payment is being processed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PENDING',
          paymentMethod,
          notes: `PayTR ödeme başlatıldı - Token: ${paymentResult.token}`,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          paymentUrl: paymentResult.paymentUrl,
          token: paymentResult.token,
          message: 'Ödeme sayfasına yönlendiriliyorsunuz...',
        },
      });
    } else {
      // Payment creation failed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
          notes: `PayTR ödeme başlatma hatası: ${paymentResult.error}`,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || 'Ödeme işlemi başlatılamadı',
          errorCode: paymentResult.errorCode,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Ödeme işlemi sırasında hata oluştu' },
      { status: 500 }
    );
  }
}