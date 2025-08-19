import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/server/db/connection';
import RefreshToken from '@/server/db/models/RefreshToken';

export async function POST(req: NextRequest) {
  const refresh = req.cookies.get('refresh_token')?.value;
  if (refresh) {
    await connectDb();
    await RefreshToken.findOneAndUpdate({ token: refresh }, { revokedAt: new Date() });
  }
  const res = NextResponse.json({});
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set('access_token', '', { httpOnly: true, secure, sameSite: 'lax', path: '/', expires: new Date(0) });
  res.cookies.set('refresh_token', '', { httpOnly: true, secure, sameSite: 'lax', path: '/', expires: new Date(0) });
  return res;
}
