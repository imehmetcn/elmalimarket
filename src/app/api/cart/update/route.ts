import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';
import { cartUpdateItemSchema } from '@/lib/validations';

// PUT /api/cart/update - Sepet öğesi güncelleme
export async function PUT(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      
      // Veri validasyonu
      const validationResult = cartUpdateItemSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Geçersiz veri',
            errors: validationResult.error.errors,
          },
          { status: 400 }
        );
      }

      const { quantity } = validationResult.data;
      const { itemId } = body;

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
          product: true,
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
            message: 'Bu sepet öğesini güncelleme yetkiniz yok',
          },
          { status: 403 }
        );
      }

      // Stok kontrolü
      if (cartItem.product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Yetersiz stok. Mevcut stok: ${cartItem.product.stock}`,
          },
          { status: 400 }
        );
      }

      // Güncel fiyatı al
      const currentPrice = cartItem.product.discountPrice || cartItem.product.price;

      // Sepet öğesini güncelle
      const updatedItem = await prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity,
          price: currentPrice, // Güncel fiyatı kullan
        },
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
      });

      // Sepeti güncelle
      await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: { updatedAt: new Date() },
      });

      // Ürün görsellerini düzenle
      const itemWithImages = {
        ...updatedItem,
        product: {
          ...updatedItem.product,
          images: updatedItem.product.images ? JSON.parse(updatedItem.product.images) : [],
        },
      };

      return NextResponse.json({
        success: true,
        message: 'Sepet öğesi güncellendi',
        data: itemWithImages,
      });
    } catch (error) {
      console.error('Cart update API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sepet güncelleme sırasında hata oluştu',
        },
        { status: 500 }
      );
    }
  });
}