import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

// DELETE /api/cart/remove - Sepetten ürün çıkarma
export async function DELETE(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const itemId = searchParams.get('itemId');

      if (!itemId) {
        return NextResponse.json(
          {
            success: false,
            message: 'Sepet öğesi ID gereklidir',
          },
          { status: 400 }
        );
      }

      // Sepet öğesini bul
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!cartItem) {
        return NextResponse.json(
          {
            success: false,
            message: 'Sepet öğesi bulunamadı',
          },
          { status: 404 }
        );
      }

      // Sepet sahipliği kontrolü
      const isOwner = req.user 
        ? cartItem.cart.userId === req.user.id
        : cartItem.cart.sessionId === request.cookies.get('session-id')?.value;

      if (!isOwner) {
        return NextResponse.json(
          {
            success: false,
            message: 'Bu sepet öğesini silme yetkiniz yok',
          },
          { status: 403 }
        );
      }

      // Sepet öğesini sil
      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      // Sepeti güncelle
      await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: `${cartItem.product.name} sepetten çıkarıldı`,
        data: {
          removedItemId: itemId,
          productName: cartItem.product.name,
        },
      });
    } catch (error) {
      console.error('Cart remove API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sepetten çıkarma sırasında hata oluştu',
        },
        { status: 500 }
      );
    }
  });
}