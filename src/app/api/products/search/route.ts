import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/products/search - Ürün arama
export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('q') || '';
      const limit = parseInt(searchParams.get('limit') || '10');
      const categoryId = searchParams.get('categoryId') || '';

      if (!query.trim()) {
        return NextResponse.json({
          success: true,
          data: [],
          message: 'Arama terimi gereklidir',
        });
      }

      // Where koşulları
      const where: any = {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      };

      // Kategori filtresi
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Arama sonuçları
      const products = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          {
            // İsimde tam eşleşme öncelikli
            name: 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
        take: Math.min(limit, 50), // Maksimum 50 sonuç
      });

      // Images string'ini array'e çevir
      const productsWithImages = products.map(product => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      }));

      return NextResponse.json({
        success: true,
        data: productsWithImages,
        query,
        total: productsWithImages.length,
      });
    } catch (error) {
      console.error('Product search API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Arama sırasında hata oluştu',
        },
        { status: 500 }
      );
    }
  });
}