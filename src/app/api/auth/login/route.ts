import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { userLoginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Veri validasyonu
    const validationResult = userLoginSchema.safeParse(body);
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

    const { email, password } = validationResult.data;

    // Kullanıcı giriş işlemi
    const result = await loginUser(email, password);
    
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'E-posta veya şifre hatalı',
        },
        { status: 401 }
      );
    }

    const { user, token } = result;

    // Response oluştur
    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
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
    console.error('Login API hatası:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Sunucu hatası',
      },
      { status: 500 }
    );
  }
}