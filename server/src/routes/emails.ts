import { z } from 'zod';
import EmailMsg from '../models/EmailMsg';
import { createTenantRouter } from './crud';

const schema = z.object({
  messageId: z.string(),
});

/**
 * @openapi
 * /emails:
 *   get:
 *     summary: List email messages.
 *     responses:
 *       '200':
 *         description: Email messages fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmailMsg'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 messageId: 'abc123'
 *   post:
 *     summary: Create an email message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailMsg'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             messageId: 'abc123'
 *     responses:
 *       '200':
 *         description: Email message created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailMsg'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               messageId: 'abc123'
 * /emails/{id}:
 *   put:
 *     summary: Update an email message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailMsg'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             messageId: 'updated123'
 *     responses:
 *       '200':
 *         description: Email message updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailMsg'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               messageId: 'updated123'
 *   delete:
 *     summary: Delete an email message.
 *     responses:
 *       '200':
 *         description: Email message deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('emails', EmailMsg, schema);
