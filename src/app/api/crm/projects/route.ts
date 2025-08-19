import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth';
import { connectDb } from '@/server/db/connection';
import Project from '@/server/db/models/Project';
import Customer from '@/server/db/models/Customer';
import JobStep from '@/server/db/models/JobStep';
import Tenant from '@/server/db/models/Tenant';
import { ProjectSchema } from '@/server/validation/crm';
import { ensureCustomer } from '@/server/services/customers';
import { seedJobStepsFromStandard } from '@/server/services/steps';
import { nextJobNo } from '@/server/services/sequence';

export async function GET(req: NextRequest) {
  try {
    const me = requireAuth()();
    await connectDb();
    const params = req.nextUrl.searchParams;
    const q = params.get('q') || '';
    const repId = params.get('repId');
    const status = params.get('status');
    const skip = Number(params.get('skip') || '0');
    const limit = Number(params.get('limit') || '50');

    const filter: any = { tenantId: me.tenantId };
    if (status) filter.status = status;
    if (me.role === 'rep') filter.repId = me.sub;
    if (repId) filter.repId = repId;
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [ { projectName: regex }, { jobNo: regex } ];
    }

    const docs = await Project.find(filter).skip(skip).limit(limit).lean();
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
    const data = ProjectSchema.parse(body);

    if (!data.customerId && !data.newCustomer) {
      return NextResponse.json({ error: 'CUSTOMER_REQUIRED' }, { status: 400 });
    }

    const customerId = await ensureCustomer({ tenantId: me.tenantId, customerId: data.customerId, newCustomer: data.newCustomer });
    const customer = await Customer.findOne({ _id: customerId, tenantId: me.tenantId }).lean();
    const contact = customer?.contact || {};
    const reachable = (contact.email1 && contact.email1Notify !== false) || (contact.mobile1 && contact.mobile1Notify !== false);
    if (!reachable) {
      return NextResponse.json({ error: 'CONTACT_REQUIRED' }, { status: 400 });
    }
    if (!data.council?.name) {
      return NextResponse.json({ error: 'COUNCIL_REQUIRED' }, { status: 400 });
    }

    const tenant = await Tenant.findById(me.tenantId).lean();
    const jobNo = await nextJobNo(tenant?.code || 'TENANT');

    const project = await Project.create({
      tenantId: me.tenantId,
      customerId,
      projectName: data.projectName,
      jobType: data.jobType,
      spaType: data.spaType,
      veType: data.veType,
      siteType: data.siteType,
      repId: data.repId,
      clientRequestDate: data.clientRequestDate,
      siteAddress: data.siteAddress,
      sitePostcode: data.sitePostcode,
      council: data.council,
      jobNotes: data.jobNotes,
      status: 'lead',
      issueNo: 1,
      jobNo
    });

    if (data.steps && data.steps.length) {
      for (const s of data.steps) {
        await JobStep.create({ tenantId: me.tenantId, projectId: project._id, ...s });
      }
    } else {
      await seedJobStepsFromStandard({ tenantId: me.tenantId, projectId: project._id.toString() });
    }

    return NextResponse.json({ id: project._id.toString(), jobNo }, { status: 201 });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    if (e.name === 'ZodError') return NextResponse.json({ error: 'VALIDATION', details: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'ERROR' }, { status: 500 });
  }
}
