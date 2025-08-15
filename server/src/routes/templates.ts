import { z } from 'zod';
import Document from '../models/Document';
import { createTenantRouter } from './crud';

const schema = z.object({
  title: z.string(),
});

/**
 * @openapi
 * /templates:
 *   get:
 *     summary: List templates.
 *     responses:
 *       '200':
 *         description: Templates fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 title: 'Template A'
 *   post:
 *     summary: Create a template.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             title: 'Template A'
 *     responses:
 *       '200':
 *         description: Template created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               title: 'Template A'
 * /templates/{id}:
 *   put:
 *     summary: Update a template.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             title: 'Updated Template'
 *     responses:
 *       '200':
 *         description: Template updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               title: 'Updated Template'
 *   delete:
 *     summary: Delete a template.
 *     responses:
 *       '200':
 *         description: Template deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('templates', Document, schema);
