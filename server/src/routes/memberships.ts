import { z } from 'zod';
import Membership from '../models/Membership';
import { createTenantRouter } from './crud';

const schema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member']),
});

/**
 * @openapi
 * /memberships:
 *   get:
 *     summary: List memberships.
 *   post:
 *     summary: Create a membership.
 * /memberships/{id}:
 *   put:
 *     summary: Update a membership.
 *   delete:
 *     summary: Delete a membership.
 */
export default createTenantRouter('memberships', Membership, schema);
