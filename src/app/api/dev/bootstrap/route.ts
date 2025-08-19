import { NextResponse } from 'next/server';
import Tenant from '@/server/db/models/Tenant';
import User from '@/server/db/models/User';
import { hashPassword } from '@/server/security/crypto';
import { env } from '@/server/config/env';
import { connectDb } from '@/server/db/connection';

export async function POST() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ code: 'DISABLED' }, { status: 403 });
  await connectDb();
  const tenant = await Tenant.findOneAndUpdate({ code: env.ADMIN_TENANT_CODE }, { name: env.ADMIN_TENANT_CODE, active: true }, { upsert: true, new: true });
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD!);
  await User.findOneAndUpdate(
    { tenantId: tenant._id, email: env.ADMIN_EMAIL!.toLowerCase() },
    { tenantId: tenant._id, email: env.ADMIN_EMAIL!.toLowerCase(), name: 'Owner', role: 'admin', passwordHash, isActive: true },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}
