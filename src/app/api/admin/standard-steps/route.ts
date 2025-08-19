import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';
import { connectDb } from '@/server/db/connection';
import StandardStep from '@/server/db/models/StandardStep';

export async function GET() {
  try {
    const me = requireAuth(['admin'])();
    await connectDb();
    const docs = await StandardStep.find({ tenantId: me.tenantId }).sort({ stepNo: 1 }).lean();
    return NextResponse.json(docs);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const me = requireAuth(['admin'])();
    await connectDb();
    const steps = await req.json();
    if (!Array.isArray(steps)) return NextResponse.json({ error: 'INVALID' }, { status: 400 });
    for (const s of steps) {
      await StandardStep.updateOne(
        { tenantId: me.tenantId, stepNo: s.stepNo },
        { $set: { ...s, tenantId: me.tenantId } },
        { upsert: true }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
