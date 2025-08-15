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
 *     responses:
 *       '200':
 *         description: Memberships fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 userId: '507f1f77bcf86cd799439012'
 *                 role: 'admin'
 *   post:
 *     summary: Create a membership.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             userId: '507f1f77bcf86cd799439012'
 *             role: 'admin'
 *     responses:
 *       '200':
 *         description: Membership created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               userId: '507f1f77bcf86cd799439012'
 *               role: 'admin'
 * /memberships/{id}:
 *   put:
 *     summary: Update a membership.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             userId: '507f1f77bcf86cd799439012'
 *             role: 'member'
 *     responses:
 *       '200':
 *         description: Membership updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               userId: '507f1f77bcf86cd799439012'
 *               role: 'member'
 *   delete:
 *     summary: Delete a membership.
 *     responses:
 *       '200':
 *         description: Membership deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('memberships', Membership, schema);
