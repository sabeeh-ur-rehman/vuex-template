import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';
import { connectDb } from '@/server/db/connection';
import Customer from '@/server/db/models/Customer';
import Tenant from '@/server/db/models/Tenant';
import { CustomerSchema } from '@/server/validation/crm';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  try {
    const me = requireAuth()();
    await connectDb();

    const q = req.nextUrl.searchParams.get('q') || '';
    const skip = Number(req.nextUrl.searchParams.get('skip') || '0');
    const limit = Number(req.nextUrl.searchParams.get('limit') || '50');

    const filter: any = { tenantId: me.tenantId };
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { customerName: regex },
        { 'contact.email1': regex },
        { 'contact.mobile1': regex }
      ];
    }

    const docs = await Customer.find(filter).skip(skip).limit(limit).lean();
    return NextResponse.json(docs);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const me = requireAuth(['admin', 'rep'])();
    await connectDb();
    const body = await req.json();
    const data = CustomerSchema.parse(body);

    if (data.contact?.email1) {
      const existing = await Customer.findOne({ tenantId: me.tenantId, customerName: data.customerName, 'contact.email1': data.contact.email1 }).lean();
      if (existing) {
        return NextResponse.json({ suggestion: existing._id }, { status: 409 });
      }
    }

    const tenant = await Tenant.findById(me.tenantId).lean();
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const customerNo = `${tenant?.code || 'TENANT'}-${yy}-${nanoid(5)}`;

    const doc = await Customer.create({ ...data, tenantId: me.tenantId, customerNo });
    return NextResponse.json({ id: doc._id.toString(), customerNo }, { status: 201 });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    if (e.name === 'ZodError') return NextResponse.json({ error: 'VALIDATION', details: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
