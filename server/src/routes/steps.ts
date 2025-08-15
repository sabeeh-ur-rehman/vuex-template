import { z } from 'zod';
import Step from '../models/Step';
import { createTenantRouter } from './crud';

const schema = z.object({
  projectId: z.string(),
});

export default createTenantRouter('steps', Step, schema);
