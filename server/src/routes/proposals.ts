import { z } from 'zod';
import Proposal from '../models/Proposal';
import { createTenantRouter } from './crud';

const schema = z.object({
  projectId: z.string(),
});

/**
 * @openapi
 * /proposals:
 *   get:
 *     summary: List proposals.
 *     responses:
 *       '200':
 *         description: Proposals fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proposal'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 projectId: '507f1f77bcf86cd799439012'
 *   post:
 *     summary: Create a proposal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposal'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             projectId: '507f1f77bcf86cd799439012'
 *     responses:
 *       '200':
 *         description: Proposal created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               projectId: '507f1f77bcf86cd799439012'
 * /proposals/{id}:
 *   put:
 *     summary: Update a proposal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposal'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             projectId: '507f1f77bcf86cd799439013'
 *     responses:
 *       '200':
 *         description: Proposal updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               projectId: '507f1f77bcf86cd799439013'
 *   delete:
 *     summary: Delete a proposal.
 *     responses:
 *       '200':
 *         description: Proposal deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('proposals', Proposal, schema);
