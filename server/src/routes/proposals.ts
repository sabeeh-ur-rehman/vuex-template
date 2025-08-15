import { Router } from 'express';
import { z } from 'zod';
import Proposal from '../models/Proposal';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const schema = z.object({
  projectId: z.string(),
});

/**
 * @openapi
 * /proposals:
 *   get:
 *     summary: List proposals
 *     tags:
 *       - Proposals
 *     responses:
 *       '200':
 *         description: A paginated list of proposals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proposal'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a proposal
 *     tags:
 *       - Proposals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposal'
 *     responses:
 *       '201':
 *         description: Created proposal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 * /proposals/{id}:
 *   get:
 *     summary: Get a proposal by id
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Proposal found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a proposal
 *     tags:
 *       - Proposals
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
 *             $ref: '#/components/schemas/Proposal'
 *     responses:
 *       '200':
 *         description: Updated proposal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a proposal
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Proposal deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('proposals', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Proposal.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    Proposal.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('proposals', 'read'), async (req: AuthenticatedRequest, res) => {
  const proposal = await Proposal.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!proposal) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(proposal);
});

router.post('/', guard('proposals', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await Proposal.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'proposals',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('proposals', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await Proposal.findOneAndUpdate(
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
    resource: 'proposals',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('proposals', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await Proposal.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'proposals',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
