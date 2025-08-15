import { z } from 'zod';
import Proposal from '../models/Proposal';
import { createTenantRouter } from './crud';

const schema = z.object({
  projectId: z.string(),
});

/**
 * @openapi
 * /proposals:
 *   get:
 *     summary: List proposals.
 *   post:
 *     summary: Create a proposal.
 * /proposals/{id}:
 *   put:
 *     summary: Update a proposal.
 *   delete:
 *     summary: Delete a proposal.
 */
export default createTenantRouter('proposals', Proposal, schema);
