import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const clientId = this.configService.get<string>('GMAIL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GMAIL_CLIENT_SECRET');
    const refreshToken = this.configService.get<string>('GMAIL_REFRESH_TOKEN');
    const smtpUser = this.configService.get<string>('SMTP_USER');

    let transporterConfig: any;

    // OAuth2 kullanımı kontrolü (Gmail için)
    if (clientId && clientSecret && refreshToken) {
      this.logger.log('OAuth2 kimlik doğrulaması kullanılıyor...');
      this.logger.log(`Kullanıcı: ${smtpUser}`);
      
      transporterConfig = {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: smtpUser,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
        },
      };
    } else {
      // Standart SMTP (Uygulama Şifresi vb.)
      transporterConfig = {
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        auth: {
          user: smtpUser,
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      };
    }

    this.transporter = nodemailer.createTransport(transporterConfig);
  }

  /**
   * HTML mail gönder
   */
  async sendHtmlMail(
    to: string,
    subject: string,
    htmlContent: string,
    from?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const defaultFrom = this.configService.get<string>('SMTP_FROM') || 
                          this.configService.get<string>('SMTP_USER');
      
      const mailOptions = {
        from: from || defaultFrom,
        to: to,
        subject: subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Mail başarıyla gönderildi: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(`Mail gönderilirken hata: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Bağlantıyı test et
   */
  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP bağlantısı başarılı!');
      return { success: true, message: 'SMTP bağlantısı başarılı' };
    } catch (error) {
      this.logger.error(`SMTP bağlantı hatası: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
