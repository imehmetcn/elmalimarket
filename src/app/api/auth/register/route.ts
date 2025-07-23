import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { userCreateSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Veri validasyonu
    const validationResult = userCreateSchema.safeParse(body);
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

    const userData = validationResult.data;

    // Kullanıcı kayıt işlemi
    const result = await registerUser(userData);
    
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kayıt işlemi başarısız. Bu e-posta adresi zaten kullanılıyor olabilir.',
        },
        { status: 400 }
      );
    }

    const { user, token } = result;

    // Response oluştur
    const response = NextResponse.json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user,
        token,
      },
    });

    // Cookie'ye token ekle
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register API hatası:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Sunucu hatası',
      },
      { status: 500 }
    );
  }
}