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
 *     responses:
 *       '200':
 *         description: Customers fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 email: 'john@example.com'
 *   post:
 *     summary: Create a customer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             email: 'john@example.com'
 *     responses:
 *       '200':
 *         description: Customer created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               email: 'john@example.com'
 * /customers/{id}:
 *   put:
 *     summary: Update a customer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             email: 'jane@example.com'
 *     responses:
 *       '200':
 *         description: Customer updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               email: 'jane@example.com'
 *   delete:
 *     summary: Delete a customer.
 *     responses:
 *       '200':
 *         description: Customer deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('customers', Customer, schema);
