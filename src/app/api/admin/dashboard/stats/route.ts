import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/dashboard/stats - Admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token gerekli' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Fetch all statistics in parallel
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      monthlyOrders,
      weeklyOrders,
      monthlyRevenue,
      weeklyRevenue,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
        },
        _sum: {
          totalAmount: true,
        },
      }),
      
      // Total products
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),
      
      // Total customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          isActive: true,
        },
      }),
      
      // Pending orders
      prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),
      
      // Low stock products (stock <= 10)
      prisma.product.count({
        where: {
          stock: {
            lte: 10,
          },
          isActive: true,
        },
      }),
      
      // Monthly orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      
      // Weekly orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfWeek,
          },
        },
      }),
      
      // Monthly revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      
      // Weekly revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: startOfWeek,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    // Get order status breakdown
    const orderStatusBreakdown = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get product details for top selling products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
          orderCount: item._count.productId,
        };
      })
    );

    // Calculate growth rates
    const calculateGrowthRate = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Get previous period data for comparison
    const previousMonth = new Date(startOfMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    const previousWeek = new Date(startOfWeek);
    previousWeek.setDate(previousWeek.getDate() - 7);

    const [previousMonthOrders, previousWeekOrders] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: {
            gte: previousMonth,
            lt: startOfMonth,
          },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: previousWeek,
            lt: startOfWeek,
          },
        },
      }),
    ]);

    const stats = {
      // Basic stats
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      
      // Period stats
      monthlyOrders,
      weeklyOrders,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      weeklyRevenue: weeklyRevenue._sum.totalAmount || 0,
      
      // Growth rates
      monthlyOrdersGrowth: calculateGrowthRate(monthlyOrders, previousMonthOrders),
      weeklyOrdersGrowth: calculateGrowthRate(weeklyOrders, previousWeekOrders),
      
      // Breakdowns
      orderStatusBreakdown: orderStatusBreakdown.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      
      // Top products
      topProducts: topProductsWithDetails,
      
      // Additional metrics
      averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0,
      conversionRate: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'İstatistikler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}