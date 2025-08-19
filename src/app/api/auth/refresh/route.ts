import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/server/db/connection';
import RefreshToken from '@/server/db/models/RefreshToken';
import User from '@/server/db/models/User';
import { signAccess } from '@/server/security/jwt';
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
  const refresh = req.cookies.get('refresh_token')?.value;
  if (!refresh) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  await connectDb();
  const record = await RefreshToken.findOne({ token: refresh, revokedAt: { $exists: false } });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
  const user = await User.findById(record.userId);
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const payload = { sub: user._id.toString(), tenantId: record.tenantId.toString(), role: user.role, name: user.name, email: user.email };
  const access = signAccess(payload);
  const res = NextResponse.json(payload);
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set('access_token', access, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: parseDuration(env.JWT_EXPIRES)/1000 });
  return res;
}
