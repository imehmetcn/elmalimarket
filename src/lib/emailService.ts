// Email service for order notifications

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderConfirmationData {
  orderId: string;
  orderNumber?: string;
  trackingNumber?: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  totalAmount: number;
  shippingAddress: any;
  paymentMethod: string;
  orderDate: Date;
}

interface OrderStatusUpdateData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export class EmailService {
  // Send order confirmation email
  static async sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
    try {
      const orderRef = data.orderNumber || data.orderId;
      const emailData: EmailData = {
        to: data.customerEmail,
        subject: `Sipariş Onayı - ${orderRef}`,
        html: this.generateOrderConfirmationHTML(data),
        text: this.generateOrderConfirmationText(data),
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Order confirmation email error:', error);
      return false;
    }
  }

  // Send order status update email
  static async sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: data.customerEmail,
        subject: `Sipariş Durumu Güncellendi - #${data.orderId}`,
        html: this.generateStatusUpdateHTML(data),
        text: this.generateStatusUpdateText(data),
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Order status update email error:', error);
      return false;
    }
  }

  // Send email using configured service (placeholder)
  private static async sendEmail(emailData: EmailData): Promise<boolean> {
    // In a real implementation, you would use a service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Resend
    
    console.log('📧 Email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      preview: emailData.text?.substring(0, 100) + '...',
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return true to simulate successful sending
    return true;
  }

  // Generate order confirmation HTML
  private static generateOrderConfirmationHTML(data: OrderConfirmationData): string {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(price);
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Sipariş Onayı</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A27; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #2D5A27; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍎 Elmalı Market</h1>
            <h2>Sipariş Onayı</h2>
          </div>
          
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            <p>Siparişiniz başarıyla alındı! Aşağıda sipariş detaylarınızı bulabilirsiniz:</p>
            
            <h3>Sipariş Bilgileri</h3>
            <p><strong>Sipariş No:</strong> ${data.orderNumber || data.orderId}</p>
            ${data.trackingNumber ? `<p><strong>Takip No:</strong> ${data.trackingNumber}</p>` : ''}
            <p><strong>Sipariş Tarihi:</strong> ${formatDate(data.orderDate)}</p>
            <p><strong>Ödeme Yöntemi:</strong> ${data.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
              data.paymentMethod === 'bank_transfer' ? 'Banka Havalesi' : 'Kapıda Ödeme'}</p>
            
            <h3>Sipariş Detayları</h3>
            ${data.items.map(item => `
              <div class="order-item">
                <strong>${item.product.name}</strong><br>
                Adet: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.totalPrice)}
              </div>
            `).join('')}
            
            <div class="total">
              <p>Toplam: ${formatPrice(data.totalAmount)}</p>
            </div>
            
            <h3>Teslimat Adresi</h3>
            <p>
              ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
              ${data.shippingAddress.phone}<br>
              ${data.shippingAddress.address}<br>
              ${data.shippingAddress.district}, ${data.shippingAddress.city} ${data.shippingAddress.postalCode}
            </p>
            
            <p>Siparişinizin durumunu takip etmek için <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}">buraya tıklayın</a>.</p>
            
            <p>Teşekkür ederiz!<br>Elmalı Market Ekibi</p>
          </div>
          
          <div class="footer">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
            <p>© 2024 Elmalı Market. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate order confirmation text
  private static generateOrderConfirmationText(data: OrderConfirmationData): string {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(price);
    };

    return `
Elmalı Market - Sipariş Onayı

Merhaba ${data.customerName},

Siparişiniz başarıyla alındı!

Sipariş No: #${data.orderId}
Toplam: ${formatPrice(data.totalAmount)}

Sipariş detaylarını görmek için: ${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}

Teşekkür ederiz!
Elmalı Market Ekibi
    `.trim();
  }

  // Generate status update HTML
  private static generateStatusUpdateHTML(data: OrderStatusUpdateData): string {
    const statusText = {
      CONFIRMED: 'Onaylandı',
      PREPARING: 'Hazırlanıyor',
      SHIPPED: 'Kargoya Verildi',
      DELIVERED: 'Teslim Edildi',
      CANCELLED: 'İptal Edildi',
    }[data.status] || data.status;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Sipariş Durumu Güncellendi</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A27; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status { background: #e8f5e8; padding: 15px; border-left: 4px solid #2D5A27; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍎 Elmalı Market</h1>
            <h2>Sipariş Durumu Güncellendi</h2>
          </div>
          
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <div class="status">
              <h3>Sipariş #${data.orderId}</h3>
              <p><strong>Yeni Durum:</strong> ${statusText}</p>
              ${data.trackingNumber ? `<p><strong>Takip Numarası:</strong> ${data.trackingNumber}</p>` : ''}
              ${data.estimatedDelivery ? `<p><strong>Tahmini Teslimat:</strong> ${data.estimatedDelivery.toLocaleDateString('tr-TR')}</p>` : ''}
            </div>
            
            <p>Siparişinizin detaylarını görmek için <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}">buraya tıklayın</a>.</p>
            
            <p>Teşekkür ederiz!<br>Elmalı Market Ekibi</p>
          </div>
          
          <div class="footer">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
            <p>© 2024 Elmalı Market. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate status update text
  private static generateStatusUpdateText(data: OrderStatusUpdateData): string {
    const statusText = {
      CONFIRMED: 'Onaylandı',
      PREPARING: 'Hazırlanıyor',
      SHIPPED: 'Kargoya Verildi',
      DELIVERED: 'Teslim Edildi',
      CANCELLED: 'İptal Edildi',
    }[data.status] || data.status;

    return `
Elmalı Market - Sipariş Durumu Güncellendi

Merhaba ${data.customerName},

Sipariş #${data.orderId}
Yeni Durum: ${statusText}
${data.trackingNumber ? `Takip Numarası: ${data.trackingNumber}` : ''}

Detaylar: ${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}

Teşekkür ederiz!
Elmalı Market Ekibi
    `.trim();
  }
}