import { z } from 'zod';
import Step from '../models/Step';
import { createTenantRouter } from './crud';

const schema = z.object({
  projectId: z.string(),
});

/**
 * @openapi
 * /steps:
 *   get:
 *     summary: List steps.
 *     responses:
 *       '200':
 *         description: Steps fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 projectId: '507f1f77bcf86cd799439012'
 *   post:
 *     summary: Create a step.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Step'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             projectId: '507f1f77bcf86cd799439012'
 *     responses:
 *       '200':
 *         description: Step created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               projectId: '507f1f77bcf86cd799439012'
 * /steps/{id}:
 *   put:
 *     summary: Update a step.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Step'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             projectId: '507f1f77bcf86cd799439013'
 *     responses:
 *       '200':
 *         description: Step updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               projectId: '507f1f77bcf86cd799439013'
 *   delete:
 *     summary: Delete a step.
 *     responses:
 *       '200':
 *         description: Step deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('steps', Step, schema);
