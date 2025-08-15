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
 *     responses:
 *       '200':
 *         description: Tenants fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tenant'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 name: 'Tenant Inc'
 *   post:
 *     summary: Create a tenant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Tenant Inc'
 *     responses:
 *       '200':
 *         description: Tenant created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Tenant Inc'
 * /tenants/{id}:
 *   put:
 *     summary: Update a tenant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Updated Tenant'
 *     responses:
 *       '200':
 *         description: Tenant updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Updated Tenant'
 *   delete:
 *     summary: Delete a tenant.
 *     responses:
 *       '200':
 *         description: Tenant deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('tenants', Tenant, schema);
