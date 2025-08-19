import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';
import { connectDb } from '@/server/db/connection';
import JobStep from '@/server/db/models/JobStep';

export async function PATCH(req: NextRequest, { params }: { params: { id: string; stepNo: string } }) {
  try {
    const me = requireAuth(['admin', 'rep'])();
    await connectDb();
    const body = await req.json();
    await JobStep.updateOne(
      { tenantId: me.tenantId, projectId: params.id, stepNo: Number(params.stepNo) },
      { $set: body }
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
