import { MailService } from './mail.service';
import { SendMailDto, SendTestMailDto } from './dto/send-mail.dto';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    healthCheck(): {
        message: string;
    };
    sendMail(sendMailDto: SendMailDto): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            messageId?: string;
            error?: string;
        };
    }>;
    sendTestMail(sendTestMailDto: SendTestMailDto): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            messageId?: string;
            error?: string;
        };
    }>;
    testConnection(): Promise<{
        success: boolean;
        message?: string;
        error?: string;
    }>;
}
