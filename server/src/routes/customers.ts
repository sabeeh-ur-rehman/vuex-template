import { z } from 'zod';
import Customer from '../models/Customer';
import { createTenantRouter } from './crud';

const schema = z.object({
  email: z.string().email(),
});

/**
 * @openapi
 * /customers:
 *   get:
 *     summary: List customers.
 *   post:
 *     summary: Create a customer.
 * /customers/{id}:
 *   put:
 *     summary: Update a customer.
 *   delete:
 *     summary: Delete a customer.
 */
export default createTenantRouter('customers', Customer, schema);
