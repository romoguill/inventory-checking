import VerificationEmail from '@/emails/VerificationEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string[];
  subject: string;
  content: JSX.Element;
}

// More general function. Try to use specific functions for usual emails
export const sendEmail = async ({ to, subject, content }: EmailOptions) => {
  return resend.emails.send({
    from: process.env.MAIL_FROM || '',
    to,
    subject,
    react: content,
  });
};

export const sendEmailVerification = (
  toEmail: string,
  toName: string | null,
  token: string
) =>
  sendEmail({
    to: [toEmail],
    subject: 'Verify your email - Check Delta',
    content: VerificationEmail({ name: toName, token }),
  });
