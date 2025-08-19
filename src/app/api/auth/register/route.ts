import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema } from '@/server/validation/auth';
import { connectDb } from '@/server/db/connection';
import Tenant from '@/server/db/models/Tenant';
import User from '@/server/db/models/User';
import { hashPassword } from '@/server/security/crypto';

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = RegisterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { name, email, password, role, tenantCode } = parsed.data;
  await connectDb();
  const tenant = await Tenant.findOneAndUpdate(
    { code: tenantCode },
    { $setOnInsert: { name: tenantCode, code: tenantCode } },
    { new: true, upsert: true }
  );
  const passwordHash = await hashPassword(password);
  await User.create({
    tenantId: tenant._id,
    email,
    name,
    role,
    passwordHash
  });
  return NextResponse.json({}, { status: 201 });
}
