import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@/types';

// POST /api/orders/guest - Misafir sipariş oluşturma
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, guestInfo, shippingAddress, paymentMethod, notes } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sipariş öğeleri gerekli' },
        { status: 400 }
      );
    }

    if (!guestInfo || !guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      return NextResponse.json(
        { success: false, error: 'Misafir bilgileri gerekli' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
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

    // Validate and calculate order items
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

    // Create guest order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create temporary user for guest order
      const guestUser = await tx.user.create({
        data: {
          email: guestInfo.email,
          password: '', // Empty password for guest users
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          phone: guestInfo.phone,
          role: 'CUSTOMER',
          isActive: false, // Mark as inactive guest user
        },
      });

      // Create shipping address
      const address = await tx.address.create({
        data: {
          userId: guestUser.id,
          title: shippingAddress.title || 'Teslimat Adresi',
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          district: shippingAddress.district,
          postalCode: shippingAddress.postalCode,
          isDefault: true,
        },
      });

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: guestUser.id,
          totalAmount,
          status: OrderStatus.PENDING,
          shippingAddressId: address.id,
          paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          notes: notes || 'Misafir siparişi',
        },
      });

      // Create order items and update product stock
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

      return { order: newOrder, user: guestUser, address };
    });

    // Get complete order data
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.order.id },
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

    // Transform order for response
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

    // Send order confirmation email to guest
    try {
      const { EmailService } = await import('@/lib/emailService');
      await EmailService.sendOrderConfirmation({
        orderId: order.order.id,
        customerName: `${guestInfo.firstName} ${guestInfo.lastName}`,
        customerEmail: guestInfo.email,
        items: transformedOrder.items,
        totalAmount: order.order.totalAmount,
        shippingAddress: transformedOrder.shippingAddress,
        paymentMethod: order.order.paymentMethod,
        orderDate: order.order.createdAt,
      });
    } catch (emailError) {
      console.error('Failed to send guest order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder,
      message: 'Misafir siparişi başarıyla oluşturuldu',
    });
  } catch (error) {
    console.error('Guest order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}