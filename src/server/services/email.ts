const nodemailer = await import('nodemailer');
import { env } from '../config/env';

let transporter = nodemailer.createTransport(
  env.EMAIL_TRANSPORT === 'smtp'
    ? { host: env.SMTP_HOST, port: Number(env.SMTP_PORT), auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined }
    : { jsonTransport: true } // fallback: prints to console
);

export async function sendMail({
  to,
  subject,
  html,
}: { to: string | string[]; subject: string; html: string }) {
  const nodemailer = await import('nodemailer'); // dynamic import

  const transporter = nodemailer.createTransport(
    process.env.EMAIL_TRANSPORT === 'smtp'
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        }
      : { jsonTransport: true }
  );

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}


