/**
 * PayTR Payment Service
 * Mock implementation for PayTR payment gateway
 * In production, you would use actual PayTR API credentials and endpoints
 */

import crypto from 'crypto';

interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

interface PaymentRequest {
  orderId: string;
  amount: number; // Amount in kuruş (1 TL = 100 kuruş)
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  basketItems: Array<{
    name: string;
    category: string;
    quantity: number;
    price: number; // Price in kuruş
  }>;
  successUrl: string;
  failUrl: string;
  timeoutLimit?: number; // in minutes
  installmentCount?: number;
}

interface PaymentResponse {
  success: boolean;
  token?: string;
  paymentUrl?: string;
  error?: string;
  errorCode?: string;
}

interface PaymentVerificationRequest {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  status?: 'success' | 'failed';
  error?: string;
}

export class PayTRService {
  private config: PayTRConfig;

  constructor() {
    this.config = {
      merchantId: process.env.PAYTR_MERCHANT_ID || 'test_merchant',
      merchantKey: process.env.PAYTR_MERCHANT_KEY || 'test_key',
      merchantSalt: process.env.PAYTR_MERCHANT_SALT || 'test_salt',
      testMode: process.env.NODE_ENV !== 'production',
    };
  }

  /**
   * Create payment request and get payment URL
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate request
      if (!this.validatePaymentRequest(request)) {
        return {
          success: false,
          error: 'Geçersiz ödeme bilgileri',
          errorCode: 'INVALID_REQUEST',
        };
      }

      // Generate payment token
      const paymentToken = this.generatePaymentToken(request);
      
      // In production, you would make actual API call to PayTR
      // For now, we'll simulate the response
      if (this.config.testMode) {
        return this.mockPaymentResponse(request, paymentToken);
      }

      // Actual PayTR API call would go here
      const paytrResponse = await this.callPayTRAPI(request, paymentToken);
      
      return paytrResponse;
    } catch (error) {
      console.error('PayTR payment creation error:', error);
      return {
        success: false,
        error: 'Ödeme işlemi başlatılamadı',
        errorCode: 'PAYMENT_CREATION_FAILED',
      };
    }
  }

  /**
   * Verify payment callback from PayTR
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    try {
      // Verify hash
      if (!this.verifyPaymentHash(request)) {
        return {
          success: false,
          error: 'Geçersiz ödeme doğrulama',
        };
      }

      // Parse payment data
      const orderId = request.merchantOid;
      const amount = parseFloat(request.totalAmount);
      const status = request.status === 'success' ? 'success' : 'failed';

      return {
        success: true,
        orderId,
        amount,
        status,
      };
    } catch (error) {
      console.error('PayTR payment verification error:', error);
      return {
        success: false,
        error: 'Ödeme doğrulama hatası',
      };
    }
  }

  /**
   * Generate payment token for PayTR
   */
  private generatePaymentToken(request: PaymentRequest): string {
    const data = [
      this.config.merchantId,
      request.orderId,
      request.amount.toString(),
      request.currency,
      request.customerName,
      request.customerEmail,
      this.config.merchantSalt,
    ].join('|');

    return crypto.createHmac('sha256', this.config.merchantKey).update(data).digest('base64');
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: PaymentRequest): boolean {
    if (!request.orderId || !request.amount || !request.customerEmail) {
      return false;
    }

    if (request.amount < 100) { // Minimum 1 TL
      return false;
    }

    if (!request.basketItems || request.basketItems.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Mock PayTR response for testing
   */
  private mockPaymentResponse(request: PaymentRequest, token: string): PaymentResponse {
    // Simulate different scenarios based on amount
    if (request.amount < 500) { // Less than 5 TL - simulate failure
      return {
        success: false,
        error: 'Minimum ödeme tutarı 5 TL olmalıdır',
        errorCode: 'MINIMUM_AMOUNT_ERROR',
      };
    }

    // Generate mock payment URL
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/mock?token=${token}&orderId=${request.orderId}`;

    return {
      success: true,
      token,
      paymentUrl,
    };
  }

  /**
   * Call actual PayTR API (placeholder)
   */
  private async callPayTRAPI(request: PaymentRequest, token: string): Promise<PaymentResponse> {
    // In production, this would make actual HTTP request to PayTR
    const paytrEndpoint = 'https://www.paytr.com/odeme/api/get-token';
    
    const formData = {
      merchant_id: this.config.merchantId,
      user_ip: '127.0.0.1', // Should be actual user IP
      merchant_oid: request.orderId,
      email: request.customerEmail,
      payment_amount: request.amount.toString(),
      paytr_token: token,
      user_basket: JSON.stringify(request.basketItems),
      debug_on: this.config.testMode ? '1' : '0',
      no_installment: request.installmentCount ? '0' : '1',
      max_installment: request.installmentCount?.toString() || '0',
      user_name: request.customerName,
      user_address: request.customerAddress,
      user_phone: request.customerPhone,
      merchant_ok_url: request.successUrl,
      merchant_fail_url: request.failUrl,
      timeout_limit: (request.timeoutLimit || 30).toString(),
      currency: request.currency,
    };

    // Mock response for now
    return {
      success: true,
      token,
      paymentUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
    };
  }

  /**
   * Verify payment hash from PayTR callback
   */
  private verifyPaymentHash(request: PaymentVerificationRequest): boolean {
    const data = [
      request.merchantOid,
      this.config.merchantSalt,
      request.status,
      request.totalAmount,
    ].join('');

    const expectedHash = crypto.createHmac('sha256', this.config.merchantKey)
      .update(data)
      .digest('base64');

    return expectedHash === request.hash;
  }

  /**
   * Get supported payment methods
   */
  getSupportedPaymentMethods() {
    return [
      {
        id: 'credit_card',
        name: 'Kredi Kartı',
        description: 'Visa, MasterCard, American Express',
        icon: '💳',
        installments: [1, 2, 3, 6, 9, 12],
      },
      {
        id: 'debit_card',
        name: 'Banka Kartı',
        description: 'Debit kart ile ödeme',
        icon: '💳',
        installments: [1],
      },
      {
        id: 'bank_transfer',
        name: 'Banka Havalesi',
        description: 'EFT/Havale ile ödeme',
        icon: '🏦',
        installments: [1],
      },
    ];
  }

  /**
   * Calculate installment options
   */
  calculateInstallments(amount: number) {
    const installmentRates = {
      1: 0,     // No interest for single payment
      2: 0.02,  // 2% for 2 installments
      3: 0.04,  // 4% for 3 installments
      6: 0.08,  // 8% for 6 installments
      9: 0.12,  // 12% for 9 installments
      12: 0.16, // 16% for 12 installments
    };

    return Object.entries(installmentRates).map(([count, rate]) => {
      const totalAmount = amount * (1 + rate);
      const monthlyAmount = totalAmount / parseInt(count);

      return {
        count: parseInt(count),
        monthlyAmount: Math.round(monthlyAmount),
        totalAmount: Math.round(totalAmount),
        interestRate: rate,
        description: count === '1' 
          ? 'Tek Çekim' 
          : `${count} Taksit (${(rate * 100).toFixed(0)}% faiz)`,
      };
    });
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount / 100); // Convert from kuruş to TL
  }

  /**
   * Convert TL to kuruş
   */
  tlToKurus(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert kuruş to TL
   */
  kurusToTl(amount: number): number {
    return amount / 100;
  }
}