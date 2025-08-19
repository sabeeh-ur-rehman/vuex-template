import { NextRequest, NextResponse } from 'next/server';
import { verifyAccess } from '@/server/security/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  try {
    const payload = verifyAccess(token);
    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}
