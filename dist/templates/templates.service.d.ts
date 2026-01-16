import { Model } from 'mongoose';
import { Template, TemplateDocument } from './schemas/template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
export declare class TemplatesService {
    private templateModel;
    private readonly logger;
    constructor(templateModel: Model<TemplateDocument>);
    findAll(fcode?: string): Promise<Template[]>;
    findOne(id: string): Promise<Template>;
    create(createTemplateDto: CreateTemplateDto): Promise<Template>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template>;
    remove(id: string): Promise<{
        deleted: boolean;
        message: string;
    }>;
    countByFcode(fcode: string): Promise<number>;
}
