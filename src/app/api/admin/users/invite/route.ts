import { requireAuth } from '@/server/middleware/auth';
import { nanoid } from 'nanoid';
import User from '@/server/db/models/User';
import { hashPassword } from '@/server/security/crypto';
import { sendMail } from '@/server/services/email';
import { resetEmail } from '@/server/services/templates/reset';
import { env } from '@/server/config/env';
import { connectDb } from '@/server/db/connection';

export async function POST(req: Request) {
  const me = requireAuth(['admin'])();
  const body = await req.json(); // { name, email, role }
  const tenantId = me.tenantId;
  await connectDb();
  const existing = await User.findOne({ tenantId, email: body.email.toLowerCase() });
  if (existing) return Response.json({ code: 'EMAIL_EXISTS' }, { status: 409 });

  const tmp = nanoid(12) + 'Aa!';
  const passwordHash = await hashPassword(tmp);

  const user = await User.create({
    tenantId, email: body.email.toLowerCase(), name: body.name, role: body.role, passwordHash, isActive: true
  });

  const token = nanoid(40);
  const expires = new Date(Date.now() + Number(env.RESET_TOKEN_TTL_MIN) * 60_000);
  const PasswordReset = (await import('@/server/db/models/PasswordReset')).default;
  await PasswordReset.create({ tenantId, userId: user._id, token, expiresAt: expires });

  const url = `${env.APP_URL}/reset-password?token=${token}`;
  const { subject, html } = resetEmail(url);
  await sendMail({ to: user.email, subject, html });

  return Response.json({ ok: true });
}
