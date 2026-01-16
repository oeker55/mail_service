import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class SendWithTemplateDto {
  @IsArray()
  recipients: string[];

  @IsString()
  @IsOptional()
  subject?: string;

  @IsObject()
  @IsOptional()
  replacements?: Record<string, string>;
}
