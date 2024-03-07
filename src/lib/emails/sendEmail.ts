import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string[];
  subject: string;
  content: JSX.Element;
}

export const sendEmail = async ({ to, subject, content }: EmailOptions) => {
  return resend.emails.send({
    from: process.env.MAIL_FROM || '',
    to,
    subject,
    react: content,
  });
};
