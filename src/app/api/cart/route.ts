import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/cart - Sepet içeriği
export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      let cart;

      if (req.user) {
        // Giriş yapmış kullanıcı
        cart = await prisma.cart.findFirst({
          where: { userId: req.user.id },
          include: {
            items: {
              include: {
                product: {
                  include: {
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
          },
        });
      } else {
        // Misafir kullanıcı - session ID'den sepet bul
        const sessionId = request.cookies.get('session-id')?.value;
        if (sessionId) {
          cart = await prisma.cart.findFirst({
            where: { sessionId },
            include: {
              items: {
                include: {
                  product: {
                    include: {
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
            },
          });
        }
      }

      if (!cart) {
        return NextResponse.json({
          success: true,
          data: {
            items: [],
            totalItems: 0,
            totalAmount: 0,
          },
        });
      }

      // Ürün görsellerini düzenle ve toplam hesapla
      const items = cart.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images ? JSON.parse(item.product.images) : [],
        },
      }));

      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return NextResponse.json({
        success: true,
        data: {
          id: cart.id,
          items,
          totalItems,
          totalAmount,
          updatedAt: cart.updatedAt,
        },
      });
    } catch (error) {
      console.error('Cart GET API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sepet bilgileri alınamadı',
        },
        { status: 500 }
      );
    }
  });
}