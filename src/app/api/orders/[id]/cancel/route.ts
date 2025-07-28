import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { OrderStatus } from '@/types';

// POST /api/orders/[id]/cancel - Sipariş iptal etme
export async function POST(
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

    const orderId = params.id;
    const body = await request.json();
    const { reason } = body;

    // Build where clause based on user role
    const where: any = { id: orderId };
    if (decoded.role !== 'admin') {
      where.userId = decoded.userId;
    }

    // Check if order exists and can be cancelled
    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
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

    // Check if order can be cancelled
    const cancellableStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { success: false, error: 'Bu sipariş iptal edilemez' },
        { status: 400 }
      );
    }

    // Cancel order and restore stock in transaction
    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          notes: reason ? `İptal nedeni: ${reason}` : 'Sipariş iptal edildi',
        },
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return updatedOrder;
    });

    // Get complete cancelled order data
    const completeOrder = await prisma.order.findUnique({
      where: { id: orderId },
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
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Transform order for response
    const transformedOrder = {
      ...completeOrder,
      items: completeOrder?.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    };

    // TODO: Send cancellation notification to customer
    console.log(`Order ${orderId} cancelled by user ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      data: transformedOrder,
      message: 'Sipariş başarıyla iptal edildi',
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş iptal edilirken hata oluştu' },
      { status: 500 }
    );
  }
}