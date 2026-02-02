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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const mail_service_1 = require("../mail/mail.service");
const create_template_dto_1 = require("./dto/create-template.dto");
const update_template_dto_1 = require("./dto/update-template.dto");
const send_with_template_dto_1 = require("./dto/send-with-template.dto");
let TemplatesController = class TemplatesController {
    constructor(templatesService, mailService) {
        this.templatesService = templatesService;
        this.mailService = mailService;
    }
    async findAll(fcode) {
        return this.templatesService.findAll(fcode);
    }
    async findByScode(scode) {
        if (!scode) {
            throw new common_1.HttpException({ error: 'scode zorunludur' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.templatesService.findByScode(scode);
    }
    async findBySubject(scode, subjectId) {
        if (!scode || !subjectId) {
            throw new common_1.HttpException({ error: 'scode ve subjectId zorunludur' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const template = await this.templatesService.findByScodeAndSubjectId(scode, subjectId);
        if (!template) {
            throw new common_1.HttpException({ error: 'Template bulunamadı' }, common_1.HttpStatus.NOT_FOUND);
        }
        return template;
    }
    async findOne(id) {
        return this.templatesService.findOne(id);
    }
    async create(createTemplateDto) {
        if (!createTemplateDto.name) {
            throw new common_1.HttpException({ error: 'name zorunludur' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.templatesService.create(createTemplateDto);
    }
    async update(id, updateTemplateDto) {
        return this.templatesService.update(id, updateTemplateDto);
    }
    async remove(id) {
        return this.templatesService.remove(id);
    }
    async sendWithTemplate(id, sendDto) {
        const template = await this.templatesService.findOne(id);
        if (!template.html_content) {
            throw new common_1.HttpException({ error: 'Template HTML içeriği bulunamadı' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let htmlContent = template.html_content;
        if (sendDto.replacements) {
            Object.entries(sendDto.replacements).forEach(([key, value]) => {
                const regex = new RegExp(`\\[\\[${key}\\]\\]`, 'g');
                htmlContent = htmlContent.replace(regex, value);
            });
        }
        const results = [];
        for (const recipient of sendDto.recipients) {
            const result = await this.mailService.sendHtmlMail(recipient, sendDto.subject || template.name, htmlContent);
            results.push({ recipient, ...result });
        }
        return {
            success: true,
            templateId: id,
            templateName: template.name,
            results,
        };
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('fcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-scode'),
    __param(0, (0, common_1.Query)('scode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findByScode", null);
__decorate([
    (0, common_1.Get)('by-subject'),
    __param(0, (0, common_1.Query)('scode')),
    __param(1, (0, common_1.Query)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findBySubject", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_with_template_dto_1.SendWithTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "sendWithTemplate", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService,
        mail_service_1.MailService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map