import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailTemplate, IEmailSender } from "../../domain";

// TODO: actual sending email implememtation using SendGrid

@Injectable()
export class EmailSender implements IEmailSender {
    private readonly logger = new Logger(EmailSender.name);

    constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

    async sendVerificationEmail(email: string, token: string, tenantName: string): Promise<void> {
        this.logger.log(`
            VERIFICATION EMAIL (STUB)
            TO: ${email}
            TENANT: ${tenantName}
            VERIFICATION TOKEN: ${token}
        `);

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async sendWelcomeEmail(email: string, tenantName: string): Promise<void> {
        this.logger.log(`
            WELCOME EMAIL (STUB)
            TO: ${email}
            TENANT: ${tenantName}
        `);

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        this.logger.log(`
            PASSWORD RESET (STUB)
            TO: ${email}
            TOKEN: ${token}
        `);

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async sendTemplateEmail(template: EmailTemplate): Promise<void> {
        this.logger.log(`
            TEMPLATE EMAIL (STUB)
            TO: ${template.to}
            SUBJECT: ${template.subject}
            BODY: ${template.body}
        `);

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
