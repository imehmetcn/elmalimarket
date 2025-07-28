import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PayTRService } from '@/lib/paytrService';
import { OrderStatus, PaymentStatus } from '@/types';
import { EmailService } from '@/lib/emailService';
import { SMSService } from '@/lib/smsService';

// POST /api/payments/webhook - PayTR webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    
    // Extract PayTR callback data
    const merchantOid = body.get('merchant_oid') as string;
    const status = body.get('status') as string;
    const totalAmount = body.get('total_amount') as string;
    const hash = body.get('hash') as string;
    const failedReasonCode = body.get('failed_reason_code') as string;
    const failedReasonMsg = body.get('failed_reason_msg') as string;

    console.log('PayTR Webhook received:', {
      merchantOid,
      status,
      totalAmount,
      hash,
      failedReasonCode,
      failedReasonMsg,
    });

    // Validate required fields
    if (!merchantOid || !status || !totalAmount || !hash) {
      console.error('Missing required webhook fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize PayTR service
    const paytrService = new PayTRService();

    // Verify payment
    const verification = await paytrService.verifyPayment({
      merchantOid,
      status,
      totalAmount,
      hash,
    });

    if (!verification.success) {
      console.error('Payment verification failed:', verification.error);
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: merchantOid },
          { orderNumber: merchantOid },
        ],
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      console.error('Order not found:', merchantOid);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order based on payment status
    const isSuccess = status === 'success';
    const newPaymentStatus = isSuccess ? PaymentStatus.PAID : PaymentStatus.FAILED;
    const newOrderStatus = isSuccess ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED;

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        updatedAt: new Date(),
        notes: isSuccess 
          ? `Ödeme başarılı - PayTR` 
          : `Ödeme başarısız - ${failedReasonMsg || 'Bilinmeyen hata'}`,
      },
    });

    // Send notifications
    if (order.user) {
      const customerName = `${order.user.firstName} ${order.user.lastName}`;

      try {
        if (isSuccess) {
          // Payment successful - send confirmation
          await EmailService.sendOrderStatusUpdate({
            orderId: order.id,
            customerName,
            customerEmail: order.user.email,
            status: 'CONFIRMED',
            trackingNumber: order.trackingNumber || undefined,
          });

          if (order.user.phone) {
            await SMSService.sendOrderStatusUpdate({
              customerPhone: order.user.phone,
              customerName,
              orderId: order.id,
              orderNumber: order.orderNumber || undefined,
              status: 'CONFIRMED',
              trackingNumber: order.trackingNumber || undefined,
            });
          }
        } else {
          // Payment failed - send failure notification
          await EmailService.sendOrderStatusUpdate({
            orderId: order.id,
            customerName,
            customerEmail: order.user.email,
            status: 'CANCELLED',
          });

          if (order.user.phone) {
            await SMSService.sendOrderStatusUpdate({
              customerPhone: order.user.phone,
              customerName,
              orderId: order.id,
              orderNumber: order.orderNumber || undefined,
              status: 'CANCELLED',
            });
          }
        }
      } catch (notificationError) {
        console.error('Failed to send payment notifications:', notificationError);
      }
    }

    // Log payment event
    console.log(`Payment ${isSuccess ? 'successful' : 'failed'} for order ${order.id}:`, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
      status,
      paymentStatus: newPaymentStatus,
      orderStatus: newOrderStatus,
    });

    // Return success response to PayTR
    return NextResponse.json({ 
      success: true,
      message: isSuccess ? 'Payment confirmed' : 'Payment failed',
    });

  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// GET /api/payments/webhook - Health check
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Payment webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}