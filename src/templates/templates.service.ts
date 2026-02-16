import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template, TemplateDocument } from './schemas/template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);

  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  /**
   * Tüm template'leri listele (fcode'a göre filtreleme opsiyonel)
   */
  async findAll(fcode?: string): Promise<Template[]> {
    const query = fcode ? { fcode } : {};
    return this.templateModel
      .find(query)
      .sort({ updatedAt: -1 })
      .exec();
  }

  /**
   * scode'a göre tüm templateleri getir
   */
  async findByScode(scode: string): Promise<Template[]> {
    return this.templateModel
      .find({ scode })
      .sort({ subjectId: 1 })
      .exec();
  }

  /**
   * scode ve subjectId ile template bul
   */
  async findByScodeAndSubjectId(scode: string, subjectId: string): Promise<Template | null> {
    return this.templateModel.findOne({ scode, subjectId }).exec();
  }

  /**
   * ID'ye göre template getir
   */
  async findOne(id: string): Promise<Template> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException(`Template #${id} bulunamadı`);
    }
    return template;
  }

  /**
   * Yeni template oluştur
   */
  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const created = new this.templateModel(createTemplateDto);
    const saved = await created.save();
    this.logger.log(`Yeni template oluşturuldu: ${saved.name} (${saved._id})`);
    return saved;
  }

  /**
   * Template güncelle
   */
  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const updated = await this.templateModel
      .findByIdAndUpdate(id, updateTemplateDto, { new: true })
      .exec();
    
    if (!updated) {
      throw new NotFoundException(`Template #${id} bulunamadı`);
    }
    
    this.logger.log(`Template güncellendi: ${updated.name} (${id})`);
    return updated;
  }

  /**
   * Template sil
   */
  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const result = await this.templateModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Template #${id} bulunamadı`);
    }
    
    this.logger.log(`Template silindi: ${result.name} (${id})`);
    return {
      deleted: true,
      message: `Template "${result.name}" başarıyla silindi`,
    };
  }

  /**
   * Fcode'a göre template say
   */
  async countByFcode(fcode: string): Promise<number> {
    return this.templateModel.countDocuments({ fcode }).exec();
  }

  /**
   * Scode'a göre template say
   */
  async countByScode(scode: string): Promise<number> {
    return this.templateModel.countDocuments({ scode }).exec();
  }

  /**
   * scode'a göre sadece mevcut subject ID'leri getir (performans için)
   */
  async getSubjectIdsByScode(scode: string): Promise<string[]> {
    const templates = await this.templateModel
      .find({ scode })
      .select('subjectId')
      .lean()
      .exec();
    return templates.map(t => t.subjectId);
  }
}
