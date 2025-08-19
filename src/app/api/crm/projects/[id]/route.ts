import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';
import { connectDb } from '@/server/db/connection';
import Project from '@/server/db/models/Project';
import { ProjectSchema } from '@/server/validation/crm';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const me = requireAuth()();
    await connectDb();
    const filter: any = { _id: params.id, tenantId: me.tenantId };
    if (me.role === 'rep') filter.repId = me.sub;
    const doc = await Project.findOne(filter).lean();
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
    const data = ProjectSchema.partial().parse(body);
    const project = await Project.findOne({ _id: params.id, tenantId: me.tenantId });
    if (!project) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    if (me.role === 'rep' && project.repId.toString() !== me.sub) {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    }
    Object.assign(project, data);
    await project.save();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    if (e.name === 'ZodError') return NextResponse.json({ error: 'VALIDATION', details: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
