import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter = nodemailer.createTransport(
  env.EMAIL_TRANSPORT === 'smtp'
    ? { host: env.SMTP_HOST, port: Number(env.SMTP_PORT), auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined }
    : { jsonTransport: true } // fallback: prints to console
);

export async function sendMail({ to, subject, html }: {to:string|string[]; subject:string; html:string}) {
  return transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}
