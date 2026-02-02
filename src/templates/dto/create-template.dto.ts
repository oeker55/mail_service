import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsOptional()
  fcode?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  scode?: string;

  @IsString()
  @IsOptional()
  subjectId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsOptional()
  elements_json?: any[];

  @IsString()
  @IsOptional()
  html_content?: string;
}
