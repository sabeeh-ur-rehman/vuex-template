import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import Tenant from '@/server/db/models/Tenant';
import User from '@/server/db/models/User';
import PasswordReset from '@/server/db/models/PasswordReset';
import { sendMail } from '@/server/services/email';
import { resetEmail } from '@/server/services/templates/reset';
import { env } from '@/server/config/env';
import { connectDb } from '@/server/db/connection';

export async function POST(req: Request) {
  const { tenantCode, email } = await req.json();
  await connectDb();
  const tenant = await Tenant.findOne({ code: tenantCode });
  if (!tenant) return NextResponse.json({ ok: true });

  const user = await User.findOne({ tenantId: tenant._id, email: email.toLowerCase(), isActive: true });
  if (!user) return NextResponse.json({ ok: true });

  const token = nanoid(40);
  const expires = new Date(Date.now() + Number(env.RESET_TOKEN_TTL_MIN) * 60_000);
  await PasswordReset.create({ tenantId: tenant._id, userId: user._id, token, expiresAt: expires });

  const url = `${env.APP_URL}/reset-password?token=${token}`;
  const { subject, html } = resetEmail(url);
  await sendMail({ to: user.email, subject, html });

  return NextResponse.json({ ok: true });
}
