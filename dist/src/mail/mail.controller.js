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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const send_mail_dto_1 = require("./dto/send-mail.dto");
let MailController = class MailController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    healthCheck() {
        return { message: 'Mail Servisi API Çalışıyor 🚀' };
    }
    async sendMail(sendMailDto) {
        const { to, subject, html } = sendMailDto;
        if (!to || !subject || !html) {
            throw new common_1.HttpException({
                success: false,
                error: 'Eksik parametreler. "to", "subject" ve "html" alanları zorunludur.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(`Mail gönderiliyor -> Kime: ${to}, Konu: ${subject}`);
        const result = await this.mailService.sendHtmlMail(to, subject, html);
        if (result.success) {
            return {
                success: true,
                message: 'Mail başarıyla gönderildi',
                data: result,
            };
        }
        else {
            throw new common_1.HttpException({
                success: false,
                error: 'Mail gönderilemedi',
                details: result.error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendTestMail(sendTestMailDto) {
        const { htmlContent, recipient, subject } = sendTestMailDto;
        if (!htmlContent || !recipient) {
            throw new common_1.HttpException({
                success: false,
                error: 'htmlContent ve recipient zorunludur',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.mailService.sendHtmlMail(recipient, subject || 'Test Email', htmlContent);
        if (result.success) {
            return {
                success: true,
                message: 'Test maili gönderildi',
                data: result,
            };
        }
        else {
            throw new common_1.HttpException({
                success: false,
                error: 'Mail gönderilemedi',
                details: result.error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async testConnection() {
        const result = await this.mailService.testConnection();
        return result;
    }
};
exports.MailController = MailController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MailController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('send-mail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_mail_dto_1.SendMailDto]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendMail", null);
__decorate([
    (0, common_1.Post)('mail/send-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_mail_dto_1.SendTestMailDto]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendTestMail", null);
__decorate([
    (0, common_1.Get)('mail/test-connection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailController.prototype, "testConnection", null);
exports.MailController = MailController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
//# sourceMappingURL=mail.controller.js.map