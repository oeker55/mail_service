import { Controller, Post, Body, Get, HttpException, HttpStatus, Header } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto, SendTestMailDto } from './dto/send-mail.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Landing Page
   */
  @Get()
  @Header('Content-Type', 'text/html')
  landingPage() {
    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>📧 Mail Service API</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 50px;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .logo {
          font-size: 80px;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        h1 {
          color: #1a202c;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #718096;
          font-size: 1.1rem;
          margin-bottom: 30px;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f0fff4;
          color: #22543d;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 30px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          background: #48bb78;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .endpoints {
          text-align: left;
          background: #f7fafc;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }
        .endpoints h3 {
          color: #4a5568;
          margin-bottom: 15px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .endpoint {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .endpoint:last-child {
          border-bottom: none;
        }
        .method {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 55px;
          text-align: center;
        }
        .method.get { background: #c6f6d5; color: #22543d; }
        .method.post { background: #bee3f8; color: #2a4365; }
        .path {
          font-family: 'Monaco', 'Consolas', monospace;
          color: #553c9a;
          font-size: 0.9rem;
        }
        .desc {
          color: #718096;
          font-size: 0.8rem;
          margin-left: auto;
        }
        .footer {
          color: #a0aec0;
          font-size: 0.85rem;
        }
        .tech {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        .tech span {
          background: #edf2f7;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #4a5568;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">📧</div>
        <h1>Mail Service API</h1>
        <p class="subtitle">Email Template & Mail Sending Service</p>
        
        <div class="status">
          <span class="status-dot"></span>
          Servis Aktif
        </div>
        
        <div class="endpoints">
          <h3>🔌 API Endpoints</h3>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/send-mail</span>
            <span class="desc">Mail gönder</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/mail/send-test</span>
            <span class="desc">Test maili</span>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/mail/test-connection</span>
            <span class="desc">Bağlantı testi</span>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/templates</span>
            <span class="desc">Şablonları listele</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/templates</span>
            <span class="desc">Şablon oluştur</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/templates/send</span>
            <span class="desc">Şablonla gönder</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Built with ❤️</p>
          <div class="tech">
            <span>NestJS</span>
            <span>MongoDB</span>
            <span>Nodemailer</span>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
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
