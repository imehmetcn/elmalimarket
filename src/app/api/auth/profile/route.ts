import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const user = req.user!;

      // Kullanıcı detaylarını getir
      const userDetails = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          addresses: {
            select: {
              id: true,
              title: true,
              firstName: true,
              lastName: true,
              phone: true,
              address: true,
              city: true,
              district: true,
              postalCode: true,
              isDefault: true,
            },
          },
        },
      });

      if (!userDetails) {
        return NextResponse.json(
          {
            success: false,
            message: 'Kullanıcı bulunamadı',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: userDetails,
      });
    } catch (error) {
      console.error('Profile API hatası:', error);
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

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const user = req.user!;
      const body = await request.json();

      // Güncellenebilir alanları filtrele
      const updateData: any = {};
      if (body.firstName) updateData.firstName = body.firstName;
      if (body.lastName) updateData.lastName = body.lastName;
      if (body.phone) updateData.phone = body.phone;

      // Kullanıcı bilgilerini güncelle
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Profil başarıyla güncellendi',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Profile update API hatası:', error);
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