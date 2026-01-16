import { Document } from 'mongoose';
export type TemplateDocument = Template & Document;
export declare class Template {
    fcode: string;
    name: string;
    elements_json: any[];
    html_content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const TemplateSchema: import("mongoose").Schema<Template, import("mongoose").Model<Template, any, any, any, Document<unknown, any, Template, any, {}> & Template & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Template, Document<unknown, {}, import("mongoose").FlatRecord<Template>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Template> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
