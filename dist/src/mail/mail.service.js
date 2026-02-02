"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.initializeTransporter();
    }
    initializeTransporter() {
        const clientId = this.configService.get('GMAIL_CLIENT_ID');
        const clientSecret = this.configService.get('GMAIL_CLIENT_SECRET');
        const refreshToken = this.configService.get('GMAIL_REFRESH_TOKEN');
        const smtpUser = this.configService.get('SMTP_USER');
        let transporterConfig;
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
        }
        else {
            transporterConfig = {
                host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
                port: parseInt(this.configService.get('SMTP_PORT') || '587'),
                secure: this.configService.get('SMTP_SECURE') === 'true',
                auth: {
                    user: smtpUser,
                    pass: this.configService.get('SMTP_PASS'),
                },
            };
        }
        this.transporter = nodemailer.createTransport(transporterConfig);
    }
    async sendHtmlMail(to, subject, htmlContent, from) {
        try {
            const defaultFrom = this.configService.get('SMTP_FROM') ||
                this.configService.get('SMTP_USER');
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
        }
        catch (error) {
            this.logger.error(`Mail gönderilirken hata: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async testConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('SMTP bağlantısı başarılı!');
            return { success: true, message: 'SMTP bağlantısı başarılı' };
        }
        catch (error) {
            this.logger.error(`SMTP bağlantı hatası: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map