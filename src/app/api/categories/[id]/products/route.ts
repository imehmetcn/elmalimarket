import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

interface RouteParams {
  params: { id: string };
}

// GET /api/categories/[id]/products - Kategoriye ait ürünler
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { id } = params;
      const { searchParams } = new URL(request.url);
      
      // Query parametreleri
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const inStock = searchParams.get('inStock');

      // Kategori var mı kontrol et
      const category = await prisma.category.findUnique({
        where: { id, isActive: true },
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

      // Where koşulları
      const where: any = {
        categoryId: id,
        isActive: true,
      };

      // Fiyat filtreleri
      if (minPrice !== null || maxPrice !== null) {
        where.price = {};
        if (minPrice) {
          where.price.gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          where.price.lte = parseFloat(maxPrice);
        }
      }

      // Stok filtresi
      if (inStock === 'true') {
        where.stock = { gt: 0 };
      }

      // Sıralama
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Sayfalama
      const skip = (page - 1) * limit;

      // Ürünleri getir
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      // Images string'ini array'e çevir
      const productsWithImages = products.map(product => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      }));

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: {
          category: {
            id: category.id,
            name: category.name,
            description: category.description,
          },
          products: productsWithImages,
        },
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      });
    } catch (error) {
      console.error('Category Products GET API hatası:', error);
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