import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, withAdminAuth, AuthenticatedRequest } from '@/lib/middleware';
import { productUpdateSchema } from '@/lib/validations';

interface RouteParams {
  params: { id: string };
}

// GET /api/products/[id] - Ürün detayı
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
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

      // Admin değilse sadece aktif ürünleri göster
      if (!req.user || req.user.role !== 'ADMIN') {
        if (!product.isActive) {
          return NextResponse.json(
            {
              success: false,
              message: 'Ürün bulunamadı',
            },
            { status: 404 }
          );
        }
      }

      // Images string'ini array'e çevir
      const productWithImages = {
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      };

      return NextResponse.json({
        success: true,
        data: productWithImages,
      });
    } catch (error) {
      console.error('Product GET API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sunucu hatası',
        },
        { status: 500 }
      );
    }
  });
}

// PUT /api/products/[id] - Ürün güncelleme (admin)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAdminAuth(request, async () => {
    try {
      const { id } = params;
      const body = await request.json();
      
      // Veri validasyonu
      const validationResult = productUpdateSchema.safeParse(body);
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

      const updateData = validationResult.data;

      // Ürün var mı kontrol et
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ürün bulunamadı',
          },
          { status: 404 }
        );
      }

      // Kategori kontrolü (eğer categoryId güncellenmişse)
      if (updateData.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: updateData.categoryId },
        });

        if (!category) {
          return NextResponse.json(
            {
              success: false,
              message: 'Geçersiz kategori',
            },
            { status: 400 }
          );
        }
      }

      // Güncelleme verilerini hazırla
      const dataToUpdate: Record<string, unknown> = { ...updateData };
      
      // Images array'ini string'e çevir
      if (updateData.images) {
        dataToUpdate.images = updateData.images;
      }

      // Ürünü güncelle
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Response için images'i array'e çevir
      const productWithImages = {
        ...updatedProduct,
        images: updatedProduct.images ? JSON.parse(updatedProduct.images) : [],
      };

      return NextResponse.json({
        success: true,
        message: 'Ürün başarıyla güncellendi',
        data: productWithImages,
      });
    } catch (error) {
      console.error('Product PUT API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sunucu hatası',
        },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/products/[id] - Ürün silme (admin)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAdminAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = params;

      // Ürün var mı kontrol et
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ürün bulunamadı',
          },
          { status: 404 }
        );
      }

      // Ürünü sil (soft delete - isActive = false)
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return NextResponse.json({
        success: true,
        message: 'Ürün başarıyla silindi',
      });
    } catch (error) {
      console.error('Product DELETE API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Sunucu hatası',
        },
        { status: 500 }
      );
    }
  });
}