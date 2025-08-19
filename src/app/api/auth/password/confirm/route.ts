import { NextResponse } from 'next/server';
import PasswordReset from '@/server/db/models/PasswordReset';
import User from '@/server/db/models/User';
import { hashPassword } from '@/server/security/crypto';
import { connectDb } from '@/server/db/connection';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();
  await connectDb();
  const pr = await PasswordReset.findOne({ token });
  if (!pr || pr.usedAt || pr.expiresAt < new Date()) return NextResponse.json({ code: 'INVALID' }, { status: 400 });

  const user = await User.findById(pr.userId);
  if (!user) return NextResponse.json({ code: 'INVALID' }, { status: 400 });

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  pr.usedAt = new Date();
  await pr.save();

  return NextResponse.json({ ok: true });
}
