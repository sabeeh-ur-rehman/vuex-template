import { z } from 'zod';
import Proposal from '../models/Proposal';
import { createTenantRouter } from './crud';

const schema = z.object({
  projectId: z.string(),
});

export default createTenantRouter('proposals', Proposal, schema);
