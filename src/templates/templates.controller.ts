import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { MailService } from '../mail/mail.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { SendWithTemplateDto } from './dto/send-with-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Tüm template'leri listele
   * GET /api/templates?fcode=XXX
   */
  @Get()
  async findAll(@Query('fcode') fcode?: string) {
    return this.templatesService.findAll(fcode);
  }

  /**
   * scode'a göre tüm templateleri getir
   * GET /api/templates/by-scode?scode=...
   */
  @Get('by-scode')
  async findByScode(@Query('scode') scode: string) {
    if (!scode) {
      throw new HttpException(
        { error: 'scode zorunludur' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.templatesService.findByScode(scode);
  }

  /**
   * scode ve subjectId ile template getir
   * GET /api/templates/by-subject?scode=...&subjectId=...
   */
  @Get('by-subject')
  async findBySubject(
    @Query('scode') scode: string,
    @Query('subjectId') subjectId: string,
  ) {
    if (!scode || !subjectId) {
      throw new HttpException(
        { error: 'scode ve subjectId zorunludur' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const template = await this.templatesService.findByScodeAndSubjectId(scode, subjectId);
    if (!template) {
      throw new HttpException(
        { error: 'Template bulunamadı' },
        HttpStatus.NOT_FOUND,
      );
    }
    return template;
  }

  /**
   * scode'a göre sadece subject ID'leri getir
   * GET /api/templates/subject-ids?scode=...
   */
  @Get('subject-ids')
  async getSubjectIds(@Query('scode') scode: string) {
    if (!scode) {
      throw new HttpException(
        { error: 'scode zorunludur' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.templatesService.getSubjectIdsByScode(scode);
  }

  /**
   * ID'ye göre template getir
   * GET /api/templates/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  /**
   * Yeni template oluştur
   * POST /api/templates
   */
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    if (!createTemplateDto.name) {
      throw new HttpException(
        { error: 'name zorunludur' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.templatesService.create(createTemplateDto);
  }

  /**
   * Template güncelle
   * PUT /api/templates/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templatesService.update(id, updateTemplateDto);
  }

  /**
   * Template sil
   * DELETE /api/templates/:id
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }

  /**
   * Template kullanarak mail gönder
   * POST /api/templates/:id/send
   */
  @Post(':id/send')
  async sendWithTemplate(
    @Param('id') id: string,
    @Body() sendDto: SendWithTemplateDto,
  ) {
    // Template'i getir
    const template = await this.templatesService.findOne(id);
    
    if (!template.html_content) {
      throw new HttpException(
        { error: 'Template HTML içeriği bulunamadı' },
        HttpStatus.BAD_REQUEST,
      );
    }

    let htmlContent = template.html_content;

    // Placeholder'ları değiştir
    if (sendDto.replacements) {
      Object.entries(sendDto.replacements).forEach(([key, value]) => {
        const regex = new RegExp(`\\[\\[${key}\\]\\]`, 'g');
        htmlContent = htmlContent.replace(regex, value as string);
      });
    }

    // Mailleri gönder
    const results = [];
    for (const recipient of sendDto.recipients) {
      const result = await this.mailService.sendHtmlMail(
        recipient,
        sendDto.subject || template.name,
        htmlContent,
      );
      results.push({ recipient, ...result });
    }

    return {
      success: true,
      templateId: id,
      templateName: template.name,
      results,
    };
  }
}
