import { z } from 'zod';
import Tenant from '../models/Tenant';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

/**
 * @openapi
 * /tenants:
 *   get:
 *     summary: List tenants.
 *   post:
 *     summary: Create a tenant.
 * /tenants/{id}:
 *   put:
 *     summary: Update a tenant.
 *   delete:
 *     summary: Delete a tenant.
 */
export default createTenantRouter('tenants', Tenant, schema);
