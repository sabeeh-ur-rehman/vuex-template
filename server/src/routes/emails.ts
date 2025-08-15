import { Router } from 'express';
import { z } from 'zod';
import EmailMsg from '../models/EmailMsg';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const schema = z.object({
  messageId: z.string(),
});

/**
 * @openapi
 * /emails:
 *   get:
 *     summary: List email messages
 *     tags:
 *       - Emails
 *     responses:
 *       '200':
 *         description: A paginated list of email messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmailMsg'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create an email message
 *     tags:
 *       - Emails
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailMsg'
 *     responses:
 *       '201':
 *         description: Created email message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailMsg'
 * /emails/{id}:
 *   get:
 *     summary: Get an email message by id
 *     tags:
 *       - Emails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Email message found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailMsg'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update an email message
 *     tags:
 *       - Emails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailMsg'
 *     responses:
 *       '200':
 *         description: Updated email message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailMsg'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete an email message
 *     tags:
 *       - Emails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Email message deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('emails', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    EmailMsg.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    EmailMsg.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('emails', 'read'), async (req: AuthenticatedRequest, res) => {
  const email = await EmailMsg.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!email) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(email);
});

router.post('/', guard('emails', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await EmailMsg.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'emails',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('emails', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await EmailMsg.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    parsed.data,
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'update',
    resource: 'emails',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('emails', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await EmailMsg.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'emails',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
