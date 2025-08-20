import { connectMongo } from '../server/src/db/mongo';
import Tenant from '../server/src/models/Tenant';
import User from '../server/src/models/User';
import { hashPassword } from '../server/src/security/crypto';
import env from '../server/src/config/env';

async function run() {
  await connectMongo();
  const tenant = await Tenant.findOneAndUpdate(
    { code: 'AWARD' },
    { name: 'Award Pools', code: 'AWARD' },
    { upsert: true, new: true }
  );
  if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    const existing = await User.findOne({ tenantId: tenant._id, email: env.ADMIN_EMAIL });
    if (!existing) {
      const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
      await User.create({
        tenantId: tenant._id,
        email: env.ADMIN_EMAIL,
        name: 'Admin',
        role: 'admin',
        passwordHash
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user exists');
    }
  } else {
    console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set');
  }
  console.log('Seed complete');
  process.exit(0);
}

run();
