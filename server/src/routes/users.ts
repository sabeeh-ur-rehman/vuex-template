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
 *     responses:
 *       '200':
 *         description: Users fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 email: 'john@example.com'
 *   post:
 *     summary: Create a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             email: 'john@example.com'
 *     responses:
 *       '200':
 *         description: User created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               email: 'john@example.com'
 * /users/{id}:
 *   put:
 *     summary: Update a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             email: 'jane@example.com'
 *     responses:
 *       '200':
 *         description: User updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               email: 'jane@example.com'
 *   delete:
 *     summary: Delete a user.
 *     responses:
 *       '200':
 *         description: User deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('users', User, schema);
