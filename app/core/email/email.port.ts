export type SendEmailVerificationInput = {
  to: string;
  verifyUrl: string;
  expiresAt: Date;
};

export interface EmailService {
  sendEmailVerification(input: SendEmailVerificationInput): Promise<void>;
}

