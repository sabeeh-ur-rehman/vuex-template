import { z } from 'zod';
import Variation from '../models/Variation';
import { createTenantRouter } from './crud';

const schema = z.object({
  proposalId: z.string(),
});

/**
 * @openapi
 * /variations:
 *   get:
 *     summary: List variations.
 *     responses:
 *       '200':
 *         description: Variations fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variation'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 proposalId: '507f1f77bcf86cd799439012'
 *   post:
 *     summary: Create a variation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variation'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             proposalId: '507f1f77bcf86cd799439012'
 *     responses:
 *       '200':
 *         description: Variation created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variation'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               proposalId: '507f1f77bcf86cd799439012'
 * /variations/{id}:
 *   put:
 *     summary: Update a variation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variation'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             proposalId: '507f1f77bcf86cd799439013'
 *     responses:
 *       '200':
 *         description: Variation updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variation'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               proposalId: '507f1f77bcf86cd799439013'
 *   delete:
 *     summary: Delete a variation.
 *     responses:
 *       '200':
 *         description: Variation deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('variations', Variation, schema);
