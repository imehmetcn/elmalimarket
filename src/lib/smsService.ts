/**
 * SMS Service for order notifications
 * This is a mock implementation - in production you would integrate with:
 * - Twilio
 * - AWS SNS
 * - Turkish SMS providers like Netgsm, İletimerkezi, etc.
 */

interface SMSData {
  to: string;
  message: string;
}

interface OrderSMSData {
  customerPhone: string;
  customerName: string;
  orderId: string;
  orderNumber?: string;
  trackingNumber?: string;
}

interface StatusUpdateSMSData {
  customerPhone: string;
  customerName: string;
  orderId: string;
  orderNumber?: string;
  status: string;
  trackingNumber?: string;
}

export class SMSService {
  // Send order confirmation SMS
  static async sendOrderConfirmation(data: OrderSMSData): Promise<boolean> {
    try {
      const orderRef = data.orderNumber || data.orderId;
      const message = `Merhaba ${data.customerName}, siparişiniz alındı! Sipariş No: ${orderRef}${
        data.trackingNumber ? `, Takip No: ${data.trackingNumber}` : ''
      }. Detaylar için: ${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId} - Elmalı Market`;

      return await this.sendSMS({
        to: data.customerPhone,
        message,
      });
    } catch (error) {
      console.error('Order confirmation SMS error:', error);
      return false;
    }
  }

  // Send order status update SMS
  static async sendOrderStatusUpdate(data: StatusUpdateSMSData): Promise<boolean> {
    try {
      const orderRef = data.orderNumber || data.orderId;
      const statusText = this.getStatusText(data.status);
      
      const message = `Merhaba ${data.customerName}, sipariş ${orderRef} durumu: ${statusText}${
        data.trackingNumber ? `. Takip No: ${data.trackingNumber}` : ''
      }. Detaylar: ${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId} - Elmalı Market`;

      return await this.sendSMS({
        to: data.customerPhone,
        message,
      });
    } catch (error) {
      console.error('Order status update SMS error:', error);
      return false;
    }
  }

  // Send shipping notification SMS
  static async sendShippingNotification(data: StatusUpdateSMSData): Promise<boolean> {
    try {
      const orderRef = data.orderNumber || data.orderId;
      const message = `Merhaba ${data.customerName}, sipariş ${orderRef} kargoya verildi!${
        data.trackingNumber ? ` Takip No: ${data.trackingNumber}` : ''
      }. Kargo takibi için: ${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId} - Elmalı Market`;

      return await this.sendSMS({
        to: data.customerPhone,
        message,
      });
    } catch (error) {
      console.error('Shipping notification SMS error:', error);
      return false;
    }
  }

  // Send delivery notification SMS
  static async sendDeliveryNotification(data: StatusUpdateSMSData): Promise<boolean> {
    try {
      const orderRef = data.orderNumber || data.orderId;
      const message = `Merhaba ${data.customerName}, sipariş ${orderRef} teslim edildi! Elmalı Market'i tercih ettiğiniz için teşekkür ederiz. Değerlendirmenizi bekliyoruz: ${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}`;

      return await this.sendSMS({
        to: data.customerPhone,
        message,
      });
    } catch (error) {
      console.error('Delivery notification SMS error:', error);
      return false;
    }
  }

  // Send SMS using configured service (mock implementation)
  private static async sendSMS(smsData: SMSData): Promise<boolean> {
    // In a real implementation, you would use a service like:
    // - Twilio
    // - AWS SNS
    // - Turkish SMS providers (Netgsm, İletimerkezi, etc.)
    
    console.log('📱 SMS would be sent:', {
      to: smsData.to,
      message: smsData.message,
      length: smsData.message.length,
    });

    // Validate phone number format
    if (!this.isValidPhoneNumber(smsData.to)) {
      console.error('Invalid phone number format:', smsData.to);
      return false;
    }

    // Validate message length (Turkish SMS limit is usually 160 characters for single SMS)
    if (smsData.message.length > 160) {
      console.warn('SMS message is longer than 160 characters, will be sent as multiple SMS');
    }

    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return true to simulate successful sending
    return true;
  }

  // Validate Turkish phone number format
  private static isValidPhoneNumber(phone: string): boolean {
    // Turkish phone number patterns:
    // +90 5XX XXX XX XX
    // 0 5XX XXX XX XX
    // 5XX XXX XX XX
    const turkishPhoneRegex = /^(\+90|0)?5\d{9}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    return turkishPhoneRegex.test(cleanPhone);
  }

  // Format phone number for SMS sending
  private static formatPhoneNumber(phone: string): string {
    let cleanPhone = phone.replace(/\s+/g, '');
    
    // Add +90 prefix if not present
    if (cleanPhone.startsWith('5')) {
      cleanPhone = '+90' + cleanPhone;
    } else if (cleanPhone.startsWith('05')) {
      cleanPhone = '+90' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('+90')) {
      cleanPhone = '+90' + cleanPhone;
    }
    
    return cleanPhone;
  }

  // Get Turkish status text
  private static getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: 'Beklemede',
      CONFIRMED: 'Onaylandı',
      PREPARING: 'Hazırlanıyor',
      SHIPPED: 'Kargoya Verildi',
      DELIVERED: 'Teslim Edildi',
      CANCELLED: 'İptal Edildi',
    };
    
    return statusMap[status] || status;
  }

  // Send bulk SMS (for marketing campaigns)
  static async sendBulkSMS(recipients: string[], message: string): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const phone of recipients) {
      try {
        const sent = await this.sendSMS({ to: phone, message });
        if (sent) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${phone}:`, error);
        failed++;
      }
      
      // Add delay between SMS to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { success, failed };
  }
}