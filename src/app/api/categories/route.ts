import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, withAdminAuth, AuthenticatedRequest } from '@/lib/middleware';
import { categoryCreateSchema } from '@/lib/validations';

// GET /api/categories - Kategori listesi
export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const includeProducts = searchParams.get('includeProducts') === 'true';
      const parentId = searchParams.get('parentId');

      // Where koşulları
      const where: {
        isActive: boolean;
        parentId?: string | null;
      } = {
        isActive: true,
      };

      // Parent kategori filtresi
      if (parentId === 'null' || parentId === '') {
        where.parentId = null; // Ana kategoriler
      } else if (parentId) {
        where.parentId = parentId; // Belirli parent'ın alt kategorileri
      }

      // Kategorileri getir
      const categories = await prisma.category.findMany({
        where,
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
              description: true,
            },
          },
          ...(includeProducts && {
            products: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
                images: true,
                stock: true,
              },
              take: 10, // İlk 10 ürün
            },
          }),
          _count: {
            select: {
              products: {
                where: { isActive: true },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Ürün görselleri için images string'ini array'e çevir
      const categoriesWithImages = categories.map(category => ({
        ...category,
        ...(includeProducts && {
          products: category.products?.map(product => ({
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
          })),
        }),
      }));

      return NextResponse.json({
        success: true,
        data: categoriesWithImages,
      });
    } catch (error) {
      console.error('Categories GET API hatası:', error);
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

// POST /api/categories - Yeni kategori oluşturma (admin)
export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      const body = await request.json();
      
      // Veri validasyonu
      const validationResult = categoryCreateSchema.safeParse(body);
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

      const categoryData = validationResult.data;

      // Parent kategori kontrolü (eğer parentId varsa)
      if (categoryData.parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: categoryData.parentId },
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

      // Kategori oluştur
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          parentId: categoryData.parentId,
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
              children: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Kategori başarıyla oluşturuldu',
        data: category,
      });
    } catch (error) {
      console.error('Category POST API hatası:', error);
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