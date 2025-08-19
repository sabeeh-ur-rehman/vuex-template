import { NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';

export async function GET() {
  try {
    const user = requireAuth(['admin'])();
    return NextResponse.json({ user });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
