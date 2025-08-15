interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  user: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Nodemailer with OAuth2.
 */
export async function sendEmail(config: OAuthConfig, options: EmailOptions) {
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
    },
  });
  await transporter.sendMail({
    from: config.user,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
