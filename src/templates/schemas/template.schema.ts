import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TemplateDocument = Template & Document;

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true, index: true })
  fcode: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  elements_json: any[];

  @Prop()
  html_content: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

// Index oluştur
TemplateSchema.index({ fcode: 1, name: 1 });
TemplateSchema.index({ updatedAt: -1 });
