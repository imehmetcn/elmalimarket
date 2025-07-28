import { NextRequest, NextResponse } from 'next/server';
import { PayTRService } from '@/lib/paytrService';

// GET /api/payments/methods - Get supported payment methods
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') || '0');

    const paytrService = new PayTRService();
    
    // Get supported payment methods
    const paymentMethods = paytrService.getSupportedPaymentMethods();
    
    // Calculate installment options if amount is provided
    let installmentOptions = [];
    if (amount > 0) {
      const amountInKurus = paytrService.tlToKurus(amount);
      installmentOptions = paytrService.calculateInstallments(amountInKurus);
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentMethods,
        installmentOptions,
        minimumAmount: 5.00, // 5 TL minimum
        currency: 'TRY',
        supportedCards: [
          {
            type: 'visa',
            name: 'Visa',
            icon: '💳',
          },
          {
            type: 'mastercard',
            name: 'MasterCard',
            icon: '💳',
          },
          {
            type: 'amex',
            name: 'American Express',
            icon: '💳',
          },
          {
            type: 'troy',
            name: 'Troy',
            icon: '💳',
          },
        ],
        features: [
          '3D Secure güvenlik',
          'SSL şifreleme',
          '256-bit güvenlik',
          '7/24 müşteri desteği',
          'Anında onay',
          'Mobil uyumlu',
        ],
      },
    });
  } catch (error) {
    console.error('Payment methods API error:', error);
    return NextResponse.json(
      { success: false, error: 'Ödeme yöntemleri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/payments/methods/validate - Validate payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentMethod, amount, cardInfo } = body;

    // Validate required fields
    if (!paymentMethod || !amount) {
      return NextResponse.json(
        { success: false, error: 'Ödeme yöntemi ve tutar gerekli' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 5) {
      return NextResponse.json(
        { success: false, error: 'Minimum ödeme tutarı 5 TL olmalıdır' },
        { status: 400 }
      );
    }

    // Validate card info for credit card payments
    if (paymentMethod === 'credit_card' && cardInfo) {
      const cardValidation = validateCardInfo(cardInfo);
      if (!cardValidation.valid) {
        return NextResponse.json(
          { success: false, error: cardValidation.error },
          { status: 400 }
        );
      }
    }

    // Validate installment count
    if (cardInfo?.installments && cardInfo.installments > 1) {
      const validInstallments = [1, 2, 3, 6, 9, 12];
      if (!validInstallments.includes(cardInfo.installments)) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz taksit sayısı' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        message: 'Ödeme yöntemi geçerli',
        estimatedProcessingTime: paymentMethod === 'bank_transfer' ? '1-2 iş günü' : 'Anında',
      },
    });
  } catch (error) {
    console.error('Payment method validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Ödeme yöntemi doğrulanırken hata oluştu' },
      { status: 500 }
    );
  }
}

// Helper function to validate card info
function validateCardInfo(cardInfo: any) {
  if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv || !cardInfo.holderName) {
    return { valid: false, error: 'Kart bilgileri eksik' };
  }

  // Basic card number validation (Luhn algorithm would be better)
  const cardNumber = cardInfo.number.replace(/\s/g, '');
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return { valid: false, error: 'Geçersiz kart numarası' };
  }

  // Expiry date validation
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(cardInfo.expiry)) {
    return { valid: false, error: 'Geçersiz son kullanma tarihi (MM/YY formatında olmalı)' };
  }

  // CVV validation
  const cvvRegex = /^\d{3,4}$/;
  if (!cvvRegex.test(cardInfo.cvv)) {
    return { valid: false, error: 'Geçersiz CVV kodu' };
  }

  // Holder name validation
  if (cardInfo.holderName.length < 2) {
    return { valid: false, error: 'Kart sahibi adı çok kısa' };
  }

  return { valid: true };
}