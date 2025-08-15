import { z } from 'zod';
import Project from '../models/Project';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

export default createTenantRouter('projects', Project, schema);
