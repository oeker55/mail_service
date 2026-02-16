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
var TemplatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const template_schema_1 = require("./schemas/template.schema");
let TemplatesService = TemplatesService_1 = class TemplatesService {
    constructor(templateModel) {
        this.templateModel = templateModel;
        this.logger = new common_1.Logger(TemplatesService_1.name);
    }
    async findAll(fcode) {
        const query = fcode ? { fcode } : {};
        return this.templateModel
            .find(query)
            .sort({ updatedAt: -1 })
            .exec();
    }
    async findByScode(scode) {
        return this.templateModel
            .find({ scode })
            .sort({ subjectId: 1 })
            .exec();
    }
    async findByScodeAndSubjectId(scode, subjectId) {
        return this.templateModel.findOne({ scode, subjectId }).exec();
    }
    async findOne(id) {
        const template = await this.templateModel.findById(id).exec();
        if (!template) {
            throw new common_1.NotFoundException(`Template #${id} bulunamadı`);
        }
        return template;
    }
    async create(createTemplateDto) {
        const created = new this.templateModel(createTemplateDto);
        const saved = await created.save();
        this.logger.log(`Yeni template oluşturuldu: ${saved.name} (${saved._id})`);
        return saved;
    }
    async update(id, updateTemplateDto) {
        const updated = await this.templateModel
            .findByIdAndUpdate(id, updateTemplateDto, { new: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Template #${id} bulunamadı`);
        }
        this.logger.log(`Template güncellendi: ${updated.name} (${id})`);
        return updated;
    }
    async remove(id) {
        const result = await this.templateModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Template #${id} bulunamadı`);
        }
        this.logger.log(`Template silindi: ${result.name} (${id})`);
        return {
            deleted: true,
            message: `Template "${result.name}" başarıyla silindi`,
        };
    }
    async countByFcode(fcode) {
        return this.templateModel.countDocuments({ fcode }).exec();
    }
    async countByScode(scode) {
        return this.templateModel.countDocuments({ scode }).exec();
    }
    async getSubjectIdsByScode(scode) {
        const templates = await this.templateModel
            .find({ scode })
            .select('subjectId')
            .lean()
            .exec();
        return templates.map(t => t.subjectId);
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = TemplatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(template_schema_1.Template.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map