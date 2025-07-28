import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/orders/[id] - Sipariş detayını getir
export async function GET(
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

    // Siparişi getir
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: decoded.userId, // Kullanıcı sadece kendi siparişlerini görebilir
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                images: true,
                categoryId: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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
            phone: true,
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

    // Images string'i array'e çevir
    const formattedOrder = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images ? JSON.parse(item.product.images) : [],
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş getirilemedi' },
      { status: 500 }
    );
  }
}