import { Router } from 'express';
import { z } from 'zod';
import Membership from '../models/Membership';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const schema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member']),
});

/**
 * @openapi
 * /memberships:
 *   get:
 *     summary: List memberships
 *     tags:
 *       - Memberships
 *     responses:
 *       '200':
 *         description: A paginated list of memberships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Membership'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a membership
 *     tags:
 *       - Memberships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       '201':
 *         description: Created membership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 * /memberships/{id}:
 *   get:
 *     summary: Get a membership by id
 *     tags:
 *       - Memberships
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Membership found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a membership
 *     tags:
 *       - Memberships
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
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       '200':
 *         description: Updated membership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a membership
 *     tags:
 *       - Memberships
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Membership deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('memberships', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Membership.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    Membership.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('memberships', 'read'), async (req: AuthenticatedRequest, res) => {
  const membership = await Membership.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!membership) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(membership);
});

router.post('/', guard('memberships', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await Membership.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'memberships',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('memberships', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await Membership.findOneAndUpdate(
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
    resource: 'memberships',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('memberships', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await Membership.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'memberships',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
