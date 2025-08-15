import { z } from 'zod';
import Tenant from '../models/Tenant';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

export default createTenantRouter('tenants', Tenant, schema);
