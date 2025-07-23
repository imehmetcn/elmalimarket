import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, withAdminAuth, AuthenticatedRequest } from '@/lib/middleware';
import { productCreateSchema, productSearchSchema } from '@/lib/validations';

// GET /api/products - Ürün listesi (arama ve filtreleme ile)
export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // Query parametrelerini al
      const searchQuery = searchParams.get('search') || '';
      const categoryId = searchParams.get('categoryId') || '';
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const inStock = searchParams.get('inStock');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';

      // Validasyon
      const validationResult = productSearchSchema.safeParse({
        search: searchQuery || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        inStock: inStock ? inStock === 'true' : undefined,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Geçersiz parametreler',
            errors: validationResult.error.errors,
          },
          { status: 400 }
        );
      }

      const { data: params } = validationResult;

      // Where koşulları
      const where: any = {
        isActive: true,
      };

      if (params.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      if (params.categoryId) {
        where.categoryId = params.categoryId;
      }

      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        where.price = {};
        if (params.minPrice !== undefined) {
          where.price.gte = params.minPrice;
        }
        if (params.maxPrice !== undefined) {
          where.price.lte = params.maxPrice;
        }
      }

      if (params.inStock) {
        where.stock = { gt: 0 };
      }

      // Sıralama
      const orderBy: any = {};
      orderBy[params.sortBy!] = params.sortOrder;

      // Sayfalama
      const skip = (params.page! - 1) * params.limit!;

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
          take: params.limit,
        }),
        prisma.product.count({ where }),
      ]);

      // Images string'ini array'e çevir
      const productsWithImages = products.map(product => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      }));

      const totalPages = Math.ceil(totalCount / params.limit!);

      return NextResponse.json({
        success: true,
        data: productsWithImages,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: totalCount,
          totalPages,
        },
      });
    } catch (error) {
      console.error('Products GET API hatası:', error);
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

// POST /api/products - Yeni ürün oluşturma (admin)
export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      
      // Veri validasyonu
      const validationResult = productCreateSchema.safeParse(body);
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

      const productData = validationResult.data;

      // Kategori kontrolü
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId },
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

      // Images array'ini string'e çevir
      const imagesString = productData.images ? productData.images : '[]';

      // Ürün oluştur
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          discountPrice: productData.discountPrice,
          stock: productData.stock,
          categoryId: productData.categoryId,
          images: imagesString,
        },
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
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      };

      return NextResponse.json({
        success: true,
        message: 'Ürün başarıyla oluşturuldu',
        data: productWithImages,
      });
    } catch (error) {
      console.error('Product POST API hatası:', error);
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