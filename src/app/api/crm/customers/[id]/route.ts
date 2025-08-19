import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';
import { connectDb } from '@/server/db/connection';
import Customer from '@/server/db/models/Customer';
import { CustomerSchema } from '@/server/validation/crm';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const me = requireAuth()();
    await connectDb();
    const doc = await Customer.findOne({ _id: params.id, tenantId: me.tenantId }).lean();
    if (!doc) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const me = requireAuth(['admin', 'rep'])();
    await connectDb();
    const body = await req.json();
    const data = CustomerSchema.partial().parse(body);
    await Customer.updateOne({ _id: params.id, tenantId: me.tenantId }, { $set: data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    if (e.name === 'ZodError') return NextResponse.json({ error: 'VALIDATION', details: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
