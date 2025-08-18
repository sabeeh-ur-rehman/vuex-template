"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Variation_1 = __importDefault(require("../models/Variation"));
const guard_1 = require("../auth/guard");
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const router = (0, express_1.Router)();
const schema = zod_1.z.object({
    proposalId: zod_1.z.string(),
    projectId: zod_1.z.string(),
    name: zod_1.z.string(),
    status: zod_1.z.string(),
    items: zod_1.z
        .array(zod_1.z.object({
        description: zod_1.z.string(),
        qty: zod_1.z.number(),
        price: zod_1.z.number(),
    }))
        .optional(),
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
router.get('/', (0, guard_1.guard)('variations', 'read'), async (req, res) => {
    var _a, _b;
    const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : '1', 10);
    const limit = parseInt((_b = req.query.limit) !== null && _b !== void 0 ? _b : '20', 10);
    const skip = (page - 1) * limit;
    const filter = { tenantId: req.tenantId };
    if (req.query.projectId) {
        filter.projectId = req.query.projectId;
    }
    const [items, total] = await Promise.all([
        Variation_1.default.find(filter).skip(skip).limit(limit).lean(),
        Variation_1.default.countDocuments(filter),
    ]);
    res.json({ items, total, page });
});
router.get('/:id', (0, guard_1.guard)('variations', 'read'), async (req, res) => {
    const variation = await Variation_1.default.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
    if (!variation) {
        return res.status(404).json({ message: 'Not found' });
    }
    res.json(variation);
});
router.post('/', (0, guard_1.guard)('variations', 'create'), async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const created = await Variation_1.default.create({ ...parsed.data, tenantId: req.tenantId });
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'create',
        resource: 'variations',
        subjectId: created._id,
        createdAt: new Date(),
    });
    res.status(201).json(created);
});
router.put('/:id', (0, guard_1.guard)('variations', 'update'), async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const updated = await Variation_1.default.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, parsed.data, { new: true });
    if (!updated) {
        return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'update',
        resource: 'variations',
        subjectId: req.params.id,
        createdAt: new Date(),
    });
    res.json(updated);
});
router.delete('/:id', (0, guard_1.guard)('variations', 'delete'), async (req, res) => {
    const deleted = await Variation_1.default.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'delete',
        resource: 'variations',
        subjectId: req.params.id,
        createdAt: new Date(),
    });
    res.status(204).send();
});
exports.default = router;
