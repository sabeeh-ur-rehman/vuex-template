import { Router } from 'express';
import { z } from 'zod';
import Proposal from '../models/Proposal';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  qty: z.number(),
  price: z.number(),
  optional: z.boolean().optional(),
  selected: z.boolean().optional(),
});

const sectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  complete: z.boolean(),
  items: z.array(itemSchema),
});

const schema = z.object({
  projectId: z.string(),
  customerId: z.string().optional(),
  priceListId: z.string().optional(),
  notes: z.string().optional(),
  sections: z.array(sectionSchema).optional(),
  showPrices: z.boolean().optional(),
  adjustment: z.number().optional(),
});

function calculateTotals(
  sections: z.infer<typeof sectionSchema>[] | undefined,
  adjustment: number | undefined
) {
  const subtotal = (sections ?? []).reduce((sum, section) => {
    return (
      sum +
      section.items.reduce((s, item) => {
        if (item.optional && !item.selected) return s;
        return s + item.qty * item.price;
      }, 0)
    );
  }, 0);
  const total = subtotal + (adjustment ?? 0);
  return { subtotal, total };
}

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
  const { subtotal, total } = calculateTotals(parsed.data.sections, parsed.data.adjustment);
  const created = await Proposal.create({
    ...parsed.data,
    subtotal,
    total,
    tenantId: req.tenantId,
  });
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
  const existing = await Proposal.findOne({ _id: req.params.id, tenantId: req.tenantId });
  if (!existing) {
    return res.status(404).json({ message: 'Not found' });
  }
  const sections = parsed.data.sections ?? existing.sections;
  const adjustment = parsed.data.adjustment ?? existing.adjustment;
  const { subtotal, total } = calculateTotals(sections, adjustment);
  const updated = await Proposal.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    { ...parsed.data, subtotal, total },
    { new: true }
  );
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
