import { Model } from 'mongoose';
import { Template, TemplateDocument } from './schemas/template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
export declare class TemplatesService {
    private templateModel;
    private readonly logger;
    constructor(templateModel: Model<TemplateDocument>);
    findAll(fcode?: string): Promise<Template[]>;
    findByScode(scode: string): Promise<Template[]>;
    findByScodeAndSubjectId(scode: string, subjectId: string): Promise<Template | null>;
    findOne(id: string): Promise<Template>;
    create(createTemplateDto: CreateTemplateDto): Promise<Template>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template>;
    remove(id: string): Promise<{
        deleted: boolean;
        message: string;
    }>;
    countByFcode(fcode: string): Promise<number>;
    countByScode(scode: string): Promise<number>;
    getSubjectIdsByScode(scode: string): Promise<string[]>;
}
