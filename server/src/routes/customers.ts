import { z } from 'zod';
import Customer from '../models/Customer';
import { createTenantRouter } from './crud';

const schema = z.object({
  email: z.string().email(),
});

export default createTenantRouter('customers', Customer, schema);
