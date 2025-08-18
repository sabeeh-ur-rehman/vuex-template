import { Types } from 'mongoose';
import Tenant from '../models/Tenant';
import User from '../models/User';
import Membership from '../models/Membership';
import Customer from '../models/Customer';
import Project from '../models/Project';
import Proposal from '../models/Proposal';
import Variation from '../models/Variation';
import connectMongo from './mongo';

async function seed() {
  const mongoose = await connectMongo();

  const tenantId = new Types.ObjectId('000000000000000000000001');
  const userId = new Types.ObjectId('000000000000000000000002');
  const customerId = new Types.ObjectId('000000000000000000000003');
  const projectId = new Types.ObjectId('000000000000000000000004');
  const proposalId = new Types.ObjectId('000000000000000000000005');

  const tenant = await Tenant.create({ _id: tenantId, tenantId, name: 'Demo Tenant' });
  const user = await User.create({ _id: userId, tenantId, email: 'admin@example.com' });
  await Membership.create({ tenantId, userId, role: 'admin' });

  const customer = await Customer.create({
    _id: customerId,
    tenantId,
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
  });

  const project = await Project.create({
    _id: projectId,
    tenantId,
    customerId,
    name: 'Sample Project',
  });

  const proposal = await Proposal.create({
    _id: proposalId,
    tenantId,
    projectId,
    customerId,
    sections: [
      {
        id: 1,
        title: 'Main Section',
        complete: false,
        items: [{ id: 1, name: 'Initial item', qty: 1, price: 100 }],
      },
    ],
    showPrices: true,
    adjustment: 0,
    subtotal: 100,
    total: 100,
  });

  await Variation.create({
    tenantId,
    projectId,
    proposalId,
    name: 'Lighting Upgrade',
    status: 'Draft',
    items: [
      { description: 'Premium fixture', qty: 2, price: 50 },
      { description: 'Installation', qty: 5, price: 40 },
    ],
  });

  console.log('Seeded tenant ID:', tenant.tenantId.toString());
  console.log('Seeded admin user:', user.email);
  console.log('Seeded sample variation: Lighting Upgrade');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
