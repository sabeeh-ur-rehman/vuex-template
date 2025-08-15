import { z } from 'zod';
import Council from '../models/Council';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

export default createTenantRouter('admin-tables', Council, schema);
