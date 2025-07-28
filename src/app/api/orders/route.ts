import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { OrderStatus, PaymentStatus } from '@/types';
import { generateOrderNumber, generateTrackingNumber } from '@/utils/orderNumber';
import { EmailService } from '@/lib/emailService';
import { SMSService } from '@/lib/smsService';

// GET /api/orders - Kullanıcının siparişlerini getir
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
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as OrderStatus | null;

    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: any = {
      userId: decoded.userId,
    };

    if (status) {
      where.status = status;
    }

    // Siparişleri getir
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
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Siparişleri dönüştür
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

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Siparişler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Sipariş oluşturma
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token gerekli' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddressId, paymentMethod, notes } = body;

    // Gerekli alanları kontrol et
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sipariş öğeleri gerekli' },
        { status: 400 }
      );
    }

    if (!shippingAddressId) {
      return NextResponse.json(
        { success: false, error: 'Teslimat adresi gerekli' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Ödeme yöntemi gerekli' },
        { status: 400 }
      );
    }

    // Teslimat adresinin kullanıcıya ait olduğunu kontrol et
    const shippingAddress = await prisma.address.findFirst({
      where: {
        id: shippingAddressId,
        userId: decoded.userId,
      },
    });

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz teslimat adresi' },
        { status: 400 }
      );
    }

    // Sipariş öğelerini doğrula ve hesapla
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { success: false, error: `Ürün bulunamadı: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Yetersiz stok: ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.discountPrice || product.price;
      const totalPrice = price * item.quantity;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        totalPrice,
      });

      totalAmount += totalPrice;
    }

    // Siparişi transaction içinde oluştur
    const order = await prisma.$transaction(async (tx) => {
      // Sipariş numarası ve takip numarası oluştur
      const orderNumber = generateOrderNumber();
      const trackingNumber = generateTrackingNumber();
      
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.userId,
          orderNumber,
          trackingNumber,
          totalAmount,
          status: OrderStatus.PENDING,
          shippingAddressId,
          paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          notes,
        },
      });

      // Sipariş öğelerini oluştur ve ürün stoklarını güncelle
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

        // Ürün stoğunu güncelle
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

    // Tam sipariş verilerini getir
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
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
      },
    });

    // Siparişi dönüştür
    const transformedOrder = {
      ...completeOrder,
      items: completeOrder?.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' 
            ? JSON.parse(item.product.images) 
            : item.product.images,
        },
      })),
    };

    // Sipariş onay e-postası ve SMS gönder
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { firstName: true, lastName: true, email: true, phone: true },
      });

      if (user) {
        // E-posta onayı gönder
        await EmailService.sendOrderConfirmation({
          orderId: order.id,
          orderNumber: order.orderNumber || order.id,
          trackingNumber: order.trackingNumber,
          customerName: `${user.firstName} ${user.lastName}`,
          customerEmail: user.email,
          items: transformedOrder.items,
          totalAmount: order.totalAmount,
          shippingAddress: transformedOrder.shippingAddress,
          paymentMethod: order.paymentMethod,
          orderDate: order.createdAt,
        });

        // Telefon numarası varsa SMS bildirimi gönder
        if (user.phone) {
          try {
            await SMSService.sendOrderConfirmation({
              customerPhone: user.phone,
              customerName: `${user.firstName} ${user.lastName}`,
              orderId: order.id,
              orderNumber: order.orderNumber,
              trackingNumber: order.trackingNumber,
            });
          } catch (smsError) {
            console.error('SMS gönderilemedi:', smsError);
          }
        }
      }
    } catch (notificationError) {
      console.error('Bildirimler gönderilemedi:', notificationError);
      // Bildirim hatası sipariş oluşturmayı engellemez
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder,
      message: 'Sipariş başarıyla oluşturuldu',
    });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulamadı' },
      { status: 500 }
    );
  }
}