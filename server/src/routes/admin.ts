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
 *     responses:
 *       '200':
 *         description: Admin tables fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Council'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 name: 'Main council'
 *   post:
 *     summary: Create an admin table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Council'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Main council'
 *     responses:
 *       '200':
 *         description: Admin table created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Council'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Main council'
 * /admin/{id}:
 *   put:
 *     summary: Update an admin table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Council'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Updated council'
 *     responses:
 *       '200':
 *         description: Admin table updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Council'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Updated council'
 *   delete:
 *     summary: Delete an admin table.
 *     responses:
 *       '200':
 *         description: Admin table deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('admin-tables', Council, schema);
