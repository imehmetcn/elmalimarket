import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, withAdminAuth, AuthenticatedRequest } from '@/lib/middleware';
import { categoryUpdateSchema } from '@/lib/validations';

interface RouteParams {
  params: { id: string };
}

// GET /api/categories/[id] - Kategori detayı
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = params;
      const { searchParams } = new URL(request.url);
      const includeProducts = searchParams.get('includeProducts') === 'true';

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          children: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              description: true,
              _count: {
                select: {
                  products: {
                    where: { isActive: true },
                  },
                },
              },
            },
          },
          ...(includeProducts && {
            products: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                discountPrice: true,
                images: true,
                stock: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          }),
          _count: {
            select: {
              products: {
                where: { isActive: true },
              },
              children: {
                where: { isActive: true },
              },
            },
          },
        },
      });

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: 'Kategori bulunamadı',
          },
          { status: 404 }
        );
      }

      // Admin değilse sadece aktif kategorileri göster
      if (!req.user || req.user.role !== 'ADMIN') {
        if (!category.isActive) {
          return NextResponse.json(
            {
              success: false,
              message: 'Kategori bulunamadı',
            },
            { status: 404 }
          );
        }
      }

      // Ürün görselleri için images string'ini array'e çevir
      const categoryWithImages = {
        ...category,
        ...(includeProducts && {
          products: category.products?.map(product => ({
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
          })),
        }),
      };

      return NextResponse.json({
        success: true,
        data: categoryWithImages,
      });
    } catch (error) {
      console.error('Category GET API hatası:', error);
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

// PUT /api/categories/[id] - Kategori güncelleme (admin)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAdminAuth(request, async () => {
    try {
      const { id } = params;
      const body = await request.json();
      
      // Veri validasyonu
      const validationResult = categoryUpdateSchema.safeParse(body);
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

      // Kategori var mı kontrol et
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return NextResponse.json(
          {
            success: false,
            message: 'Kategori bulunamadı',
          },
          { status: 404 }
        );
      }

      // Parent kategori kontrolü (eğer parentId güncellenmişse)
      if (updateData.parentId) {
        // Kendi kendisini parent yapmasını engelle
        if (updateData.parentId === id) {
          return NextResponse.json(
            {
              success: false,
              message: 'Kategori kendi kendisinin parent\'ı olamaz',
            },
            { status: 400 }
          );
        }

        const parentCategory = await prisma.category.findUnique({
          where: { id: updateData.parentId },
        });

        if (!parentCategory) {
          return NextResponse.json(
            {
              success: false,
              message: 'Geçersiz parent kategori',
            },
            { status: 400 }
          );
        }
      }

      // Kategoriyi güncelle
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          children: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: {
                where: { isActive: true },
              },
              children: {
                where: { isActive: true },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Kategori başarıyla güncellendi',
        data: updatedCategory,
      });
    } catch (error) {
      console.error('Category PUT API hatası:', error);
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

// DELETE /api/categories/[id] - Kategori silme (admin)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAdminAuth(request, async () => {
    try {
      const { id } = params;

      // Kategori var mı kontrol et
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            where: { isActive: true },
          },
          children: {
            where: { isActive: true },
          },
        },
      });

      if (!existingCategory) {
        return NextResponse.json(
          {
            success: false,
            message: 'Kategori bulunamadı',
          },
          { status: 404 }
        );
      }

      // Alt kategoriler varsa silmeyi engelle
      if (existingCategory.children.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.',
          },
          { status: 400 }
        );
      }

      // Aktif ürünler varsa silmeyi engelle
      if (existingCategory.products.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Bu kategoride aktif ürünler var. Önce ürünleri başka kategoriye taşıyın veya silin.',
          },
          { status: 400 }
        );
      }

      // Kategoriyi sil (soft delete - isActive = false)
      await prisma.category.update({
        where: { id },
        data: { isActive: false },
      });

      return NextResponse.json({
        success: true,
        message: 'Kategori başarıyla silindi',
      });
    } catch (error) {
      console.error('Category DELETE API hatası:', error);
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