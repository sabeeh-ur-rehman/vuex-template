import { z } from 'zod';
import User from '../models/User';
import { createTenantRouter } from './crud';

const schema = z.object({
  email: z.string().email(),
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users.
 *   post:
 *     summary: Create a user.
 * /users/{id}:
 *   put:
 *     summary: Update a user.
 *   delete:
 *     summary: Delete a user.
 */
export default createTenantRouter('users', User, schema);
