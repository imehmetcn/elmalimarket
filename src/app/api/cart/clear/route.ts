import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

// DELETE /api/cart/clear - Sepeti temizleme
export async function DELETE(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      let cart;

      // Sepeti bul
      if (req.user) {
        cart = await prisma.cart.findFirst({
          where: { userId: req.user.id },
        });
      } else {
        const sessionId = request.cookies.get('session-id')?.value;
        if (sessionId) {
          cart = await prisma.cart.findFirst({
            where: { sessionId },
          });
        }
      }

      if (!cart) {
        return NextResponse.json(
          {
            success: false,
            message: 'Sepet bulunamadı',
          },
          { status: 404 }
        );
      }

      // Sepetteki tüm öğeleri sil
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Sepeti güncelle
      await prisma.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: 'Sepet temizlendi',
        data: {
          cartId: cart.id,
        },
      });
    } catch (error) {
      console.error('Cart clear API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sepet temizleme sırasında hata oluştu',
        },
        { status: 500 }
      );
    }
  });
}