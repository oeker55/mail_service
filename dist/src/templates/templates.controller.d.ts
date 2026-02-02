import { TemplatesService } from './templates.service';
import { MailService } from '../mail/mail.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { SendWithTemplateDto } from './dto/send-with-template.dto';
export declare class TemplatesController {
    private readonly templatesService;
    private readonly mailService;
    constructor(templatesService: TemplatesService, mailService: MailService);
    findAll(fcode?: string): Promise<import("./schemas/template.schema").Template[]>;
    findByScode(scode: string): Promise<import("./schemas/template.schema").Template[]>;
    findBySubject(scode: string, subjectId: string): Promise<import("./schemas/template.schema").Template>;
    findOne(id: string): Promise<import("./schemas/template.schema").Template>;
    create(createTemplateDto: CreateTemplateDto): Promise<import("./schemas/template.schema").Template>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<import("./schemas/template.schema").Template>;
    remove(id: string): Promise<{
        deleted: boolean;
        message: string;
    }>;
    sendWithTemplate(id: string, sendDto: SendWithTemplateDto): Promise<{
        success: boolean;
        templateId: string;
        templateName: string;
        results: any[];
    }>;
}
