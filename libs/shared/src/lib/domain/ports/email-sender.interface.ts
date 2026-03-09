export interface EmailTemplate {
    to: string;
    subject: string;
    body: string;
    variables?: Record<string, string>;
}

export interface IEmailSender {
  sendVerificationEmail(email: string, token: string, tenantName: string): Promise<void>;
  sendWelcomeEmail(email: string, tenantName: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendTemplateEmail(template: EmailTemplate): Promise<void>;
}

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');
