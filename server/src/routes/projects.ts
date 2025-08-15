import { z } from 'zod';
import Project from '../models/Project';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: List projects.
 *     responses:
 *       '200':
 *         description: Projects fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 name: 'Project Alpha'
 *   post:
 *     summary: Create a project.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Project Alpha'
 *     responses:
 *       '200':
 *         description: Project created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Project Alpha'
 * /projects/{id}:
 *   put:
 *     summary: Update a project.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Updated Project'
 *     responses:
 *       '200':
 *         description: Project updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Updated Project'
 *   delete:
 *     summary: Delete a project.
 *     responses:
 *       '200':
 *         description: Project deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('projects', Project, schema);
