import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';
import { cartAddItemSchema } from '@/lib/validations';
import { randomUUID } from 'crypto';

// POST /api/cart/add - Sepete ürün ekleme
export async function POST(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      
      // Veri validasyonu
      const validationResult = cartAddItemSchema.safeParse(body);
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

      const { productId, quantity } = validationResult.data;

      // Ürün kontrolü
      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
      });

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ürün bulunamadı',
          },
          { status: 404 }
        );
      }

      // Stok kontrolü
      if (product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Yetersiz stok. Mevcut stok: ${product.stock}`,
          },
          { status: 400 }
        );
      }

      let cart;
      let sessionId: string | undefined;

      // Sepeti bul veya oluştur
      if (req.user) {
        // Giriş yapmış kullanıcı
        cart = await prisma.cart.findFirst({
          where: { userId: req.user.id },
        });

        if (!cart) {
          cart = await prisma.cart.create({
            data: { userId: req.user.id },
          });
        }
      } else {
        // Misafir kullanıcı
        sessionId = request.cookies.get('session-id')?.value;
        
        if (!sessionId) {
          sessionId = randomUUID();
        }

        cart = await prisma.cart.findFirst({
          where: { sessionId },
        });

        if (!cart) {
          cart = await prisma.cart.create({
            data: { sessionId },
          });
        }
      }

      // Mevcut sepet öğesini kontrol et
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      const currentPrice = product.discountPrice || product.price;

      if (existingItem) {
        // Mevcut öğeyi güncelle
        const newQuantity = existingItem.quantity + quantity;
        
        // Toplam stok kontrolü
        if (product.stock < newQuantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Yetersiz stok. Sepetinizde ${existingItem.quantity} adet var. Maksimum ${product.stock} adet ekleyebilirsiniz.`,
            },
            { status: 400 }
          );
        }

        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: newQuantity,
            price: currentPrice, // Güncel fiyatı kullan
          },
        });
      } else {
        // Yeni öğe ekle
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            price: currentPrice,
          },
        });
      }

      // Sepeti güncelle
      await prisma.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });

      // Response oluştur
      const response = NextResponse.json({
        success: true,
        message: 'Ürün sepete eklendi',
        data: {
          productName: product.name,
          quantity,
          cartId: cart.id,
        },
      });

      // Misafir kullanıcı için session cookie'si ekle
      if (!req.user && sessionId) {
        response.cookies.set('session-id', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 gün
          path: '/',
        });
      }

      return response;
    } catch (error) {
      console.error('Cart add API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sepete ekleme sırasında hata oluştu',
        },
        { status: 500 }
      );
    }
  });
}