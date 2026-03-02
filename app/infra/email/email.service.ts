type SendEmailVerificationInput = {
  to: string;
  verifyUrl: string;
  expiresAt: Date;
};

export interface EmailService {
  sendEmailVerification(input: SendEmailVerificationInput): Promise<void>;
}

function logVerificationEmail(input: SendEmailVerificationInput) {
  // Dev-only sink: deja trazabilidad local hasta integrar SMTP/provider real.
  console.info('[email][verification-link]', {
    to: input.to,
    verifyUrl: input.verifyUrl,
    expiresAt: input.expiresAt.toISOString(),
  });
}

export const emailService: EmailService = {
  async sendEmailVerification(input) {
    logVerificationEmail(input);
  },
};

