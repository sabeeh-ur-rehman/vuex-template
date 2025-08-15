import { Router } from 'express';
import { z } from 'zod';
import Council from '../models/Council';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const schema = z.object({
  name: z.string(),
});

/**
 * @openapi
 * /admin:
 *   get:
 *     summary: List councils
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: A paginated list of councils
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Council'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a council
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Council'
 *     responses:
 *       '201':
 *         description: Created council
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Council'
 * /admin/{id}:
 *   get:
 *     summary: Get a council by id
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Council found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Council'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a council
 *     tags:
 *       - Admin
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
 *             $ref: '#/components/schemas/Council'
 *     responses:
 *       '200':
 *         description: Updated council
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Council'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a council
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Council deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('admin-tables', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Council.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    Council.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('admin-tables', 'read'), async (req: AuthenticatedRequest, res) => {
  const item = await Council.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(item);
});

router.post('/', guard('admin-tables', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await Council.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'admin-tables',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('admin-tables', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await Council.findOneAndUpdate(
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
    resource: 'admin-tables',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('admin-tables', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await Council.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'admin-tables',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
