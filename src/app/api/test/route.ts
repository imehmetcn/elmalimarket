import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      // Veritabanı bağlantısını test et
      await prisma.$connect();
      
      // Kullanıcı sayısını al
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      const categoryCount = await prisma.category.count();
      
      return NextResponse.json({
        success: true,
        message: 'API çalışıyor!',
        timestamp: new Date().toISOString(),
        user: req.user || null,
        stats: {
          users: userCount,
          products: productCount,
          categories: categoryCount,
        },
      });
    } catch (error) {
      console.error('Test API hatası:', error);
      
      return NextResponse.json(
        {
          success: false,
          message: 'API hatası!',
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  });
}