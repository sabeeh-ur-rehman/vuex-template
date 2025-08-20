import './_bootstrap'; // optional shared connect
import mongoose from 'mongoose';
import env from '../server/src/config/env';
import Tenant from '../server/src/models/Tenant';
import User from '../server/src/models/User';
import { hashPassword } from '../server/src/security/crypto';

(async () => {
  await mongoose.connect(env.mongoUri!);
  const tenant = await Tenant.findOneAndUpdate(
    { code: env.ADMIN_TENANT_CODE }, { name: env.ADMIN_TENANT_CODE, code: env.ADMIN_TENANT_CODE, active: true },
    { upsert: true, new: true }
  );
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD!);
  const user = await User.findOneAndUpdate(
    { tenantId: tenant._id, email: env.ADMIN_EMAIL!.toLowerCase() },
    { tenantId: tenant._id, email: env.ADMIN_EMAIL!.toLowerCase(), name: 'Owner', role: 'admin', passwordHash, isActive: true },
    { upsert: true, new: true }
  );
  console.log('Seeded admin:', { tenant: tenant.code, email: user.email });
  await mongoose.disconnect();
})();
