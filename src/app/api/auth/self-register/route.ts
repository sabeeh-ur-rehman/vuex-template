import { NextResponse } from 'next/server';
import Tenant from '@/server/db/models/Tenant';
import User from '@/server/db/models/User';
import { hashPassword } from '@/server/security/crypto';
import { env } from '@/server/config/env';
import { SelfRegisterSchema } from '@/server/validation/auth';
import { connectDb } from '@/server/db/connection';

export async function POST(req: Request) {
  if (env.ALLOW_SELF_REGISTER !== 'true') {
    return NextResponse.json({ code: 'DISABLED', message: 'Self register disabled' }, { status: 403 });
  }
  const body = await req.json();
  const data = SelfRegisterSchema.parse(body);
  await connectDb();
  const tenant = await Tenant.findOne({ code: data.tenantCode });
  if (!tenant) return NextResponse.json({ code: 'TENANT_NOT_FOUND' }, { status: 404 });

  const exists = await User.findOne({ tenantId: tenant._id, email: data.email.toLowerCase() });
  if (exists) return NextResponse.json({ code: 'EMAIL_EXISTS' }, { status: 409 });

  const passwordHash = await hashPassword(data.password);
  const isFirstUser = (await User.countDocuments({ tenantId: tenant._id })) === 0;

  const user = await User.create({
    tenantId: tenant._id,
    email: data.email.toLowerCase(),
    name: data.name,
    role: isFirstUser ? 'admin' : 'rep',  // first user becomes admin
    passwordHash, isActive: true
  });

  return NextResponse.json({ ok: true, role: user.role });
}
