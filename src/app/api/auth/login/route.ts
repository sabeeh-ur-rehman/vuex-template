import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/server/validation/auth';
import { connectDb } from '@/server/db/connection';
import Tenant from '@/server/db/models/Tenant';
import User from '@/server/db/models/User';
import RefreshToken from '@/server/db/models/RefreshToken';
import { verifyPassword } from '@/server/security/crypto';
import { signAccess } from '@/server/security/jwt';
import { nanoid } from 'nanoid';
import { env } from '@/server/config/env';

const parseDuration = (s: string) => {
  const m = s.match(/(\d+)([smhd])/);
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  const unit = m[2];
  const mult: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return n * (mult[unit] || 0);
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { email, password, tenantCode } = parsed.data;
  await connectDb();
  const tenant = await Tenant.findOne({ code: tenantCode });
  if (!tenant) return NextResponse.json({ error: 'INVALID' }, { status: 401 });
  const user = await User.findOne({ tenantId: tenant._id, email });
  if (!user) return NextResponse.json({ error: 'INVALID' }, { status: 401 });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'INVALID' }, { status: 401 });

  const payload = { sub: user._id.toString(), tenantId: tenant._id.toString(), role: user.role, name: user.name, email: user.email };
  const access = signAccess(payload);
  const refreshToken = nanoid();
  const expiresAt = new Date(Date.now() + parseDuration(env.REFRESH_EXPIRES));
  await RefreshToken.create({ tenantId: tenant._id, userId: user._id, token: refreshToken, expiresAt });

  const res = NextResponse.json(payload);
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set('access_token', access, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: parseDuration(env.JWT_EXPIRES)/1000 });
  res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure, sameSite: 'lax', path: '/', expires: expiresAt });
  return res;
}
