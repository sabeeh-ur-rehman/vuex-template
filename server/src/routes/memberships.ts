import { z } from 'zod';
import Membership from '../models/Membership';
import { createTenantRouter } from './crud';

const schema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member']),
});

export default createTenantRouter('memberships', Membership, schema);
