import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendHtmlMail(to: string, subject: string, htmlContent: string, from?: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    testConnection(): Promise<{
        success: boolean;
        message?: string;
        error?: string;
    }>;
}
