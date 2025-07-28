// Payment service for handling different payment methods

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardInfo?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

export interface PaymentWebhookData {
  transactionId: string;
  orderId: string;
  status: 'success' | 'failed';
  amount: number;
  currency: string;
  timestamp: Date;
}

export class PaymentService {
  // Process credit card payment
  static async processCreditCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate card info
      if (!request.cardInfo) {
        return {
          success: false,
          error: 'Kart bilgileri gerekli',
          status: 'failed',
        };
      }

      // Simulate card validation
      const isValidCard = this.validateCreditCard(request.cardInfo);
      if (!isValidCard) {
        return {
          success: false,
          error: 'Geçersiz kart bilgileri',
          status: 'failed',
        };
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const transactionId = this.generateTransactionId();
        
        return {
          success: true,
          transactionId,
          status: 'completed',
          message: 'Ödeme başarıyla tamamlandı',
        };
      } else {
        return {
          success: false,
          error: 'Ödeme işlemi başarısız. Lütfen kart bilgilerinizi kontrol edin.',
          status: 'failed',
        };
      }
    } catch (error) {
      console.error('Credit card payment error:', error);
      return {
        success: false,
        error: 'Ödeme işlemi sırasında hata oluştu',
        status: 'failed',
      };
    }
  }

  // Process bank transfer payment
  static async processBankTransferPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // For bank transfer, we just create a pending payment
      // Customer will transfer money manually
      
      const transactionId = this.generateTransactionId();
      
      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Banka havalesi için ödeme talimatları e-posta ile gönderildi',
      };
    } catch (error) {
      console.error('Bank transfer payment error:', error);
      return {
        success: false,
        error: 'Banka havalesi işlemi sırasında hata oluştu',
        status: 'failed',
      };
    }
  }

  // Process cash on delivery
  static async processCashOnDeliveryPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate COD constraints
      if (request.amount > 500) {
        return {
          success: false,
          error: 'Kapıda ödeme maksimum 500 TL olabilir',
          status: 'failed',
        };
      }

      const transactionId = this.generateTransactionId();
      
      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Kapıda ödeme seçildi. Ürün tesliminde ödeme yapılacak.',
      };
    } catch (error) {
      console.error('Cash on delivery payment error:', error);
      return {
        success: false,
        error: 'Kapıda ödeme işlemi sırasında hata oluştu',
        status: 'failed',
      };
    }
  }

  // Main payment processing method
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    switch (request.paymentMethod) {
      case 'credit_card':
        return this.processCreditCardPayment(request);
      case 'bank_transfer':
        return this.processBankTransferPayment(request);
      case 'cash_on_delivery':
        return this.processCashOnDeliveryPayment(request);
      default:
        return {
          success: false,
          error: 'Desteklenmeyen ödeme yöntemi',
          status: 'failed',
        };
    }
  }

  // Handle payment webhook (for real payment providers)
  static async handlePaymentWebhook(webhookData: PaymentWebhookData): Promise<boolean> {
    try {
      // In a real implementation, you would:
      // 1. Verify webhook signature
      // 2. Update order payment status in database
      // 3. Send confirmation email to customer
      // 4. Update inventory if needed

      console.log('Payment webhook received:', webhookData);

      // Update order payment status
      const { prisma } = await import('@/lib/prisma');
      await prisma.order.update({
        where: { id: webhookData.orderId },
        data: {
          paymentStatus: webhookData.status === 'success' ? 'PAID' : 'FAILED',
        },
      });

      return true;
    } catch (error) {
      console.error('Payment webhook error:', error);
      return false;
    }
  }

  // Validate credit card (basic validation)
  private static validateCreditCard(cardInfo: PaymentRequest['cardInfo']): boolean {
    if (!cardInfo) return false;

    // Remove spaces and validate card number
    const cardNumber = cardInfo.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) return false;

    // Validate expiry date
    const [month, year] = cardInfo.expiryDate.split('/');
    if (!month || !year) return false;
    
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) return false;

    // Validate CVV
    if (!/^\d{3,4}$/.test(cardInfo.cvv)) return false;

    // Validate card holder name
    if (!cardInfo.cardHolder || cardInfo.cardHolder.length < 2) return false;

    return true;
  }

  // Generate transaction ID
  private static generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp}${random}`;
  }

  // Get payment method display name
  static getPaymentMethodName(method: string): string {
    const methodNames = {
      credit_card: 'Kredi Kartı',
      bank_transfer: 'Banka Havalesi',
      cash_on_delivery: 'Kapıda Ödeme',
    };
    
    return methodNames[method as keyof typeof methodNames] || method;
  }

  // Calculate payment fees
  static calculatePaymentFee(amount: number, method: string): number {
    switch (method) {
      case 'credit_card':
        return Math.round(amount * 0.025); // 2.5% fee
      case 'bank_transfer':
        return 0; // No fee
      case 'cash_on_delivery':
        return 5; // Fixed 5 TL fee
      default:
        return 0;
    }
  }

  // Check if payment method is available
  static isPaymentMethodAvailable(method: string, amount: number, city: string): boolean {
    switch (method) {
      case 'credit_card':
        return amount >= 10 && amount <= 10000; // Min 10 TL, Max 10,000 TL
      case 'bank_transfer':
        return amount >= 50; // Min 50 TL
      case 'cash_on_delivery':
        return amount <= 500 && city === 'İstanbul'; // Max 500 TL, only Istanbul
      default:
        return false;
    }
  }
}

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

// Payment method constants
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;