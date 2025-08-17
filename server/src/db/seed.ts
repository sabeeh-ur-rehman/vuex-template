import { Types } from 'mongoose';
import Tenant from '../models/Tenant';
import User from '../models/User';
import Membership from '../models/Membership';
import connectMongo from './mongo';

async function seed() {
  const mongoose = await connectMongo();

  const tenantId = new Types.ObjectId('000000000000000000000001');
  const userId = new Types.ObjectId('000000000000000000000002');

  const tenant = await Tenant.create({ _id: tenantId, tenantId, name: 'Demo Tenant' });
  const user = await User.create({ _id: userId, tenantId, email: 'admin@example.com' });
  await Membership.create({ tenantId, userId, role: 'admin' });

  console.log('Seeded tenant ID:', tenant.tenantId.toString());
  console.log('Seeded admin user:', user.email);

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
