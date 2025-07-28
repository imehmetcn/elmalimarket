import { prisma } from './prisma';
// Enum tanımları
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CreateOrderData {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddressId: string;
  paymentMethod: string;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export class OrderService {
  // Validate order items and calculate total
  static async validateOrderItems(items: { productId: string; quantity: number }[]) {
    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new Error(`Ürün bulunamadı: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Yetersiz stok: ${product.name} (Mevcut: ${product.stock}, İstenen: ${item.quantity})`);
      }

      const price = product.discountPrice || product.price;
      const totalPrice = price * item.quantity;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        totalPrice,
        product,
      });

      totalAmount += totalPrice;
    }

    return { validatedItems, totalAmount };
  }

  // Create order with stock management
  static async createOrder(data: CreateOrderData) {
    const { userId, items, shippingAddressId, paymentMethod, notes } = data;

    // Validate shipping address
    const shippingAddress = await prisma.address.findFirst({
      where: {
        id: shippingAddressId,
        userId,
      },
    });

    if (!shippingAddress) {
      throw new Error('Geçersiz teslimat adresi');
    }

    // Validate items and calculate total
    const { validatedItems, totalAmount } = await this.validateOrderItems(items);

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          shippingAddressId,
          paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          notes,
        },
      });

      // Create order items and update stock
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return order;
  }

  // Get order with full details
  static async getOrderById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                images: true,
                categoryId: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    // Transform images
    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    };
  }

  // Get orders with filters and pagination
  static async getOrders(
    filters: OrderFilters = {},
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.userId) where.userId = filters.userId;

    if (filters.search) {
      where.OR = [
        { id: { contains: filters.search } },
        { user: { firstName: { contains: filters.search } } },
        { user: { lastName: { contains: filters.search } } },
        { user: { email: { contains: filters.search } } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
          shippingAddress: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Transform orders
    const transformedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    }));

    return {
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    updates: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      trackingNumber?: string;
      notes?: string;
    }
  ) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: updates,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Transform order
    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    };
  }

  // Cancel order and restore stock
  static async cancelOrder(orderId: string, userId?: string, reason?: string) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;

    // Get order with items
    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error('Sipariş bulunamadı');
    }

    // Check if order can be cancelled
    const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status as OrderStatus)) {
      throw new Error('Bu sipariş iptal edilemez');
    }

    // Cancel order and restore stock
    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          notes: reason ? `İptal nedeni: ${reason}` : 'Sipariş iptal edildi',
        },
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return updatedOrder;
    });

    return cancelledOrder;
  }

  // Get order statistics
  static async getOrderStats(filters: Omit<OrderFilters, 'status'> = {}) {
    const where: any = {};
    
    if (filters.userId) where.userId = filters.userId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const stats = await prisma.order.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: stat._count.status,
        totalAmount: stat._sum.totalAmount || 0,
      };
      return acc;
    }, {} as Record<string, { count: number; totalAmount: number }>);
  }
}