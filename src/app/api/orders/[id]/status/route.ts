import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { OrderStatus } from '@/types';
import { EmailService } from '@/lib/emailService';
import { SMSService } from '@/lib/smsService';

// PUT /api/orders/[id]/status - Sipariş durumu güncelleme (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token gerekli' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Yetki gerekli' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, trackingNumber, estimatedDelivery, notes } = body;

    // Validate status
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz sipariş durumu' },
        { status: 400 }
      );
    }

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Update order status
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (estimatedDelivery) {
      updateData.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (notes) {
      updateData.notes = notes;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
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
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Send notifications if status changed
    if (currentOrder.status !== status && updatedOrder.user) {
      const customerName = `${updatedOrder.user.firstName} ${updatedOrder.user.lastName}`;
      
      try {
        // Send email notification
        await EmailService.sendOrderStatusUpdate({
          orderId: updatedOrder.id,
          customerName,
          customerEmail: updatedOrder.user.email,
          status,
          trackingNumber: updatedOrder.trackingNumber || undefined,
          estimatedDelivery: updatedOrder.estimatedDelivery || undefined,
        });

        // Send SMS notification
        if (updatedOrder.user.phone) {
          if (status === OrderStatus.SHIPPED) {
            // Special notification for shipping
            await SMSService.sendShippingNotification({
              customerPhone: updatedOrder.user.phone,
              customerName,
              orderId: updatedOrder.id,
              orderNumber: updatedOrder.orderNumber,
              status,
              trackingNumber: updatedOrder.trackingNumber || undefined,
            });
          } else if (status === OrderStatus.DELIVERED) {
            // Special notification for delivery
            await SMSService.sendDeliveryNotification({
              customerPhone: updatedOrder.user.phone,
              customerName,
              orderId: updatedOrder.id,
              orderNumber: updatedOrder.orderNumber,
              status,
              trackingNumber: updatedOrder.trackingNumber || undefined,
            });
          } else {
            // General status update
            await SMSService.sendOrderStatusUpdate({
              customerPhone: updatedOrder.user.phone,
              customerName,
              orderId: updatedOrder.id,
              orderNumber: updatedOrder.orderNumber,
              status,
              trackingNumber: updatedOrder.trackingNumber || undefined,
            });
          }
        }
      } catch (notificationError) {
        console.error('Failed to send status update notifications:', notificationError);
        // Don't fail the status update if notifications fail
      }
    }

    // Transform order for response
    const transformedOrder = {
      ...updatedOrder,
      items: updatedOrder.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: transformedOrder,
      message: 'Sipariş durumu güncellendi',
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş durumu güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}