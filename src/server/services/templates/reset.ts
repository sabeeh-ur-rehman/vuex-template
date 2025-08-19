export const resetEmail = (resetUrl: string) => ({
  subject: 'Reset your Award Projects password',
  html: `<p>Click to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 60 minutes.</p>`
});
