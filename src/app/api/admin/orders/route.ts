import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { OrderStatus, PaymentStatus } from '@/types';

// GET /api/admin/orders - Admin sipariş listesi
export async function GET(request: NextRequest) {
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
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const status = searchParams.get('status') as OrderStatus | null;
    const paymentStatus = searchParams.get('paymentStatus') as PaymentStatus | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search in order number, customer name, or email
    if (search) {
      where.OR = [
        {
          orderNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate + 'T23:59:59.999Z');
      }
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Transform orders for response
    const transformedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    }));

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Siparişler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/orders - Toplu sipariş durumu güncelleme
export async function PUT(request: NextRequest) {
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
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { orderIds, status, trackingNumber, estimatedDelivery, notes } = body;

    // Validate required fields
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sipariş ID\'leri gerekli' },
        { status: 400 }
      );
    }

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz sipariş durumu' },
        { status: 400 }
      );
    }

    // Update orders
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

    const updatedOrders = await prisma.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
      },
      data: updateData,
    });

    // Send notifications for each updated order
    try {
      const orders = await prisma.order.findMany({
        where: {
          id: {
            in: orderIds,
          },
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
        },
      });

      // Import services dynamically to avoid circular dependencies
      const { EmailService } = await import('@/lib/emailService');
      const { SMSService } = await import('@/lib/smsService');

      for (const order of orders) {
        if (order.user) {
          const customerName = `${order.user.firstName} ${order.user.lastName}`;

          // Send email notification
          await EmailService.sendOrderStatusUpdate({
            orderId: order.id,
            customerName,
            customerEmail: order.user.email,
            status,
            trackingNumber: order.trackingNumber || undefined,
            estimatedDelivery: order.estimatedDelivery || undefined,
          });

          // Send SMS notification
          if (order.user.phone) {
            if (status === OrderStatus.SHIPPED) {
              await SMSService.sendShippingNotification({
                customerPhone: order.user.phone,
                customerName,
                orderId: order.id,
                orderNumber: order.orderNumber,
                status,
                trackingNumber: order.trackingNumber || undefined,
              });
            } else if (status === OrderStatus.DELIVERED) {
              await SMSService.sendDeliveryNotification({
                customerPhone: order.user.phone,
                customerName,
                orderId: order.id,
                orderNumber: order.orderNumber,
                status,
                trackingNumber: order.trackingNumber || undefined,
              });
            } else {
              await SMSService.sendOrderStatusUpdate({
                customerPhone: order.user.phone,
                customerName,
                orderId: order.id,
                orderNumber: order.orderNumber,
                status,
                trackingNumber: order.trackingNumber || undefined,
              });
            }
          }
        }
      }
    } catch (notificationError) {
      console.error('Failed to send bulk status update notifications:', notificationError);
      // Don't fail the status update if notifications fail
    }

    return NextResponse.json({
      success: true,
      data: {
        updatedCount: updatedOrders.count,
      },
      message: `${updatedOrders.count} sipariş güncellendi`,
    });
  } catch (error) {
    console.error('Bulk order status update error:', error);
    return NextResponse.json(
      { success: false, error: 'Toplu güncelleme sırasında hata oluştu' },
      { status: 500 }
    );
  }
}