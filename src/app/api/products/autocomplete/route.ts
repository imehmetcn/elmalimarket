import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware';

interface AutocompleteItem {
  id: string;
  name: string;
  type: 'product' | 'category';
  category?: string;
}

// GET /api/products/autocomplete - Otomatik tamamlama
export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('q') || '';
      const limit = parseInt(searchParams.get('limit') || '8');

      if (!query.trim() || query.length < 2) {
        return NextResponse.json({
          success: true,
          data: [],
          message: 'En az 2 karakter giriniz',
        });
      }

      const suggestions: AutocompleteItem[] = [];

      // Ürün önerileri
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        take: Math.min(limit - 2, 6), // Kategori için yer bırak
      });

      // Ürünleri ekle
      products.forEach(product => {
        suggestions.push({
          id: product.id,
          name: product.name,
          type: 'product',
          category: product.category?.name,
        });
      });

      // Kategori önerileri
      const categories = await prisma.category.findMany({
        where: {
          isActive: true,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        orderBy: {
          name: 'asc',
        },
        take: 2,
      });

      // Kategorileri ekle
      categories.forEach(category => {
        suggestions.push({
          id: category.id,
          name: category.name,
          type: 'category',
        });
      });

      // Popüler arama terimleri (basit implementasyon)
      if (suggestions.length < limit) {
        const popularTerms = [
          'elma', 'domates', 'muz', 'ekmek', 'süt', 'peynir', 
          'tavuk', 'et', 'pirinç', 'makarna', 'su', 'yoğurt'
        ];

        const matchingTerms = popularTerms
          .filter(term => term.toLowerCase().includes(query.toLowerCase()))
          .slice(0, limit - suggestions.length);

        matchingTerms.forEach(term => {
          if (!suggestions.some(s => s.name.toLowerCase() === term.toLowerCase())) {
            suggestions.push({
              id: `search-${term}`,
              name: term,
              type: 'product',
            });
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: suggestions.slice(0, limit),
        query,
      });
    } catch (error) {
      console.error('Autocomplete API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Otomatik tamamlama sırasında hata oluştu',
        },
        { status: 500 }
      );
    }
  });
}