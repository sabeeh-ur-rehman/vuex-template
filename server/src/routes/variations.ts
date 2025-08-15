import { z } from 'zod';
import Variation from '../models/Variation';
import { createTenantRouter } from './crud';

const schema = z.object({
  proposalId: z.string(),
});

/**
 * @openapi
 * /variations:
 *   get:
 *     summary: List variations.
 *   post:
 *     summary: Create a variation.
 * /variations/{id}:
 *   put:
 *     summary: Update a variation.
 *   delete:
 *     summary: Delete a variation.
 */
export default createTenantRouter('variations', Variation, schema);
