import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto, SendTestMailDto } from './dto/send-mail.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Health check
   */
  @Get()
  healthCheck() {
    return { message: 'Mail Servisi API Çalışıyor 🚀' };
  }

  /**
   * Eski endpoint - geriye uyumluluk için
   * POST /api/send-mail
   */
  @Post('send-mail')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    const { to, subject, html } = sendMailDto;

    if (!to || !subject || !html) {
      throw new HttpException(
        {
          success: false,
          error: 'Eksik parametreler. "to", "subject" ve "html" alanları zorunludur.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(`Mail gönderiliyor -> Kime: ${to}, Konu: ${subject}`);

    const result = await this.mailService.sendHtmlMail(to, subject, html);

    if (result.success) {
      return {
        success: true,
        message: 'Mail başarıyla gönderildi',
        data: result,
      };
    } else {
      throw new HttpException(
        {
          success: false,
          error: 'Mail gönderilemedi',
          details: result.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Test maili gönder
   * POST /api/mail/send-test
   */
  @Post('mail/send-test')
  async sendTestMail(@Body() sendTestMailDto: SendTestMailDto) {
    const { htmlContent, recipient, subject } = sendTestMailDto;

    if (!htmlContent || !recipient) {
      throw new HttpException(
        {
          success: false,
          error: 'htmlContent ve recipient zorunludur',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.mailService.sendHtmlMail(
      recipient,
      subject || 'Test Email',
      htmlContent,
    );

    if (result.success) {
      return {
        success: true,
        message: 'Test maili gönderildi',
        data: result,
      };
    } else {
      throw new HttpException(
        {
          success: false,
          error: 'Mail gönderilemedi',
          details: result.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * SMTP bağlantısını test et
   * GET /api/mail/test-connection
   */
  @Get('mail/test-connection')
  async testConnection() {
    const result = await this.mailService.testConnection();
    return result;
  }
}
