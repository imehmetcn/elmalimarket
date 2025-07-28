import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/user/addresses - Kullanıcı adreslerini getir
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

    const addresses = await prisma.address.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error('Addresses GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Adresler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/user/addresses - Yeni adres ekle
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
    const {
      title,
      firstName,
      lastName,
      phone,
      address,
      city,
      district,
      postalCode,
      isDefault = false,
    } = body;

    // Validate required fields
    if (!title || !firstName || !lastName || !phone || !address || !city || !district || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: decoded.userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: decoded.userId,
        title,
        firstName,
        lastName,
        phone,
        address,
        city,
        district,
        postalCode,
        isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      data: newAddress,
      message: 'Adres başarıyla eklendi',
    });
  } catch (error) {
    console.error('Address creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Adres eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}