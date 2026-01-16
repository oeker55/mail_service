import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  fcode: string;

  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  elements_json?: any[];

  @IsString()
  @IsOptional()
  html_content?: string;
}
