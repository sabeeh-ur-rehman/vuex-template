import { Router } from 'express';
import { z } from 'zod';
import PriceList from '../models/PriceList';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

const router = Router();

const itemSchema = z.object({
  name: z.string(),
  unit: z.string().optional(),
  price: z.number(),
  description: z.string().optional(),
});

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  items: z.array(itemSchema).optional(),
});

/**
 * @openapi
 * /price-lists:
 *   get:
 *     summary: List price lists
 *     tags:
 *       - Price Lists
 *     responses:
 *       '200':
 *         description: A paginated list of price lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PriceList'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a price list
 *     tags:
 *       - Price Lists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriceList'
 *     responses:
 *       '201':
 *         description: Created price list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 * /price-lists/{id}:
 *   get:
 *     summary: Get a price list by id
 *     tags:
 *       - Price Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Price list found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a price list
 *     tags:
 *       - Price Lists
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
 *             $ref: '#/components/schemas/PriceList'
 *     responses:
 *       '200':
 *         description: Updated price list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a price list
 *     tags:
 *       - Price Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Price list deleted
 *       '404':
 *         description: Not found
 */

router.get('/', guard('price-lists', 'read'), async (req: AuthenticatedRequest, res) => {
  const page = parseInt((req.query.page as string) ?? '1', 10);
  const limit = parseInt((req.query.limit as string) ?? '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    PriceList.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
    PriceList.countDocuments({ tenantId: req.tenantId }),
  ]);

  res.json({ items, total, page });
});

router.get('/:id', guard('price-lists', 'read'), async (req: AuthenticatedRequest, res) => {
  const list = await PriceList.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
  if (!list) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(list);
});

router.post('/', guard('price-lists', 'create'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const created = await PriceList.create({ ...parsed.data, tenantId: req.tenantId });
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'create',
    resource: 'price-lists',
    subjectId: created._id,
    createdAt: new Date(),
  });
  res.status(201).json(created);
});

router.put('/:id', guard('price-lists', 'update'), async (req: AuthenticatedRequest, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const updated = await PriceList.findOneAndUpdate(
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
    resource: 'price-lists',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.json(updated);
});

router.delete('/:id', guard('price-lists', 'delete'), async (req: AuthenticatedRequest, res) => {
  const deleted = await PriceList.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  await AuditLog.create({
    tenantId: req.tenantId!,
    action: 'delete',
    resource: 'price-lists',
    subjectId: req.params.id,
    createdAt: new Date(),
  });
  res.status(204).send();
});

export default router;
