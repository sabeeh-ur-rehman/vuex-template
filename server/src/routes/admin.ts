import { z } from 'zod';
import Council from '../models/Council';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

/**
 * @openapi
 * /admin:
 *   get:
 *     summary: List admin tables.
 *   post:
 *     summary: Create an admin table.
 * /admin/{id}:
 *   put:
 *     summary: Update an admin table.
 *   delete:
 *     summary: Delete an admin table.
 */
export default createTenantRouter('admin-tables', Council, schema);
