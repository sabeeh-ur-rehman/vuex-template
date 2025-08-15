import { Router } from 'express';
import { z } from 'zod';
import Variation from '../models/Variation';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const schema = z.object({
  proposalId: z.string(),
});

/**
 * @openapi
 * /variations:
 *   get:
 *     summary: List variations
 *     tags:
 *       - Variations
 *     responses:
 *       '200':
 *         description: A paginated list of variations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variation'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a variation
 *     tags:
 *       - Variations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variation'
 *     responses:
 *       '201':
 *         description: Created variation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variation'
 * /variations/{id}:
 *   get:
 *     summary: Get a variation by id
 *     tags:
 *       - Variations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Variation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variation'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a variation
 *     tags:
 *       - Variations
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
 *             $ref: '#/components/schemas/Variation'
 *     responses:
 *       '200':
 *         description: Updated variation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variation'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a variation
 *     tags:
 *       - Variations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Variation deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('variations', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Variation.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    Variation.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('variations', 'read'), async (req: AuthenticatedRequest, res) => {
  const variation = await Variation.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!variation) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(variation);
});

router.post('/', guard('variations', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await Variation.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'variations',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('variations', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await Variation.findOneAndUpdate(
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
    resource: 'variations',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('variations', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await Variation.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'variations',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
