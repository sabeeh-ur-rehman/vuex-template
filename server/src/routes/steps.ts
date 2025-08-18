import { Router } from 'express';
import { z } from 'zod';
import Step from '../models/Step';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const dateSchema = z.preprocess(
  (arg) => (arg ? new Date(arg as string) : undefined),
  z.date(),
);

const schema = z.object({
  projectId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number().optional(),
  status: z.string().optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
});

/**
 * @openapi
 * /steps:
 *   get:
 *     summary: List steps
 *     tags:
 *       - Steps
 *     responses:
 *       '200':
 *         description: A paginated list of steps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Step'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a step
 *     tags:
 *       - Steps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Step'
 *     responses:
 *       '201':
 *         description: Created step
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 * /steps/{id}:
 *   get:
 *     summary: Get a step by id
 *     tags:
 *       - Steps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Step found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a step
 *     tags:
 *       - Steps
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
 *             $ref: '#/components/schemas/Step'
 *     responses:
 *       '200':
 *         description: Updated step
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a step
 *     tags:
 *       - Steps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Step deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('steps', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Step.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    Step.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('steps', 'read'), async (req: AuthenticatedRequest, res) => {
  const step = await Step.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!step) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(step);
});

router.post('/', guard('steps', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await Step.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'steps',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('steps', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await Step.findOneAndUpdate(
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
    resource: 'steps',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('steps', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await Step.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'steps',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
