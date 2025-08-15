import { z } from 'zod';
import Variation from '../models/Variation';
import { createTenantRouter } from './crud';

const schema = z.object({
  proposalId: z.string(),
});

export default createTenantRouter('variations', Variation, schema);
