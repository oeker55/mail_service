import { IsString, IsEmail, IsOptional } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;
}

export class SendTestMailDto {
  @IsString()
  htmlContent: string;

  @IsEmail()
  recipient: string;

  @IsString()
  @IsOptional()
  subject?: string;
}
