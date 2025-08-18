"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Proposal_1 = __importDefault(require("../models/Proposal"));
const guard_1 = require("../auth/guard");
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const router = (0, express_1.Router)();
const itemSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    qty: zod_1.z.number(),
    price: zod_1.z.number(),
    optional: zod_1.z.boolean().optional(),
    selected: zod_1.z.boolean().optional(),
});
const sectionSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    complete: zod_1.z.boolean(),
    items: zod_1.z.array(itemSchema),
});
const schema = zod_1.z.object({
    projectId: zod_1.z.string(),
    customerId: zod_1.z.string().optional(),
    priceListId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    sections: zod_1.z.array(sectionSchema).optional(),
    showPrices: zod_1.z.boolean().optional(),
    adjustment: zod_1.z.number().optional(),
});
function calculateTotals(sections, adjustment) {
    const subtotal = (sections !== null && sections !== void 0 ? sections : []).reduce((sum, section) => {
        return (sum +
            section.items.reduce((s, item) => {
                if (item.optional && !item.selected)
                    return s;
                return s + item.qty * item.price;
            }, 0));
    }, 0);
    const total = subtotal + (adjustment !== null && adjustment !== void 0 ? adjustment : 0);
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
router.get('/', (0, guard_1.guard)('proposals', 'read'), async (req, res) => {
    var _a, _b;
    const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : '1', 10);
    const limit = parseInt((_b = req.query.limit) !== null && _b !== void 0 ? _b : '20', 10);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Proposal_1.default.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
        Proposal_1.default.countDocuments({ tenantId: req.tenantId }),
    ]);
    res.json({ items, total, page });
});
router.get('/:id', (0, guard_1.guard)('proposals', 'read'), async (req, res) => {
    const proposal = await Proposal_1.default.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
    if (!proposal) {
        return res.status(404).json({ message: 'Not found' });
    }
    res.json(proposal);
});
router.post('/', (0, guard_1.guard)('proposals', 'create'), async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const { subtotal, total } = calculateTotals(parsed.data.sections, parsed.data.adjustment);
    const created = await Proposal_1.default.create({
        ...parsed.data,
        subtotal,
        total,
        tenantId: req.tenantId,
    });
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'create',
        resource: 'proposals',
        subjectId: created._id,
        createdAt: new Date(),
    });
    res.status(201).json(created);
});
router.put('/:id', (0, guard_1.guard)('proposals', 'update'), async (req, res) => {
    var _a, _b;
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const existing = await Proposal_1.default.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!existing) {
        return res.status(404).json({ message: 'Not found' });
    }
    const sections = (_a = parsed.data.sections) !== null && _a !== void 0 ? _a : existing.sections;
    const adjustment = (_b = parsed.data.adjustment) !== null && _b !== void 0 ? _b : existing.adjustment;
    const { subtotal, total } = calculateTotals(sections, adjustment);
    const updated = await Proposal_1.default.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, { ...parsed.data, subtotal, total }, { new: true });
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'update',
        resource: 'proposals',
        subjectId: req.params.id,
        createdAt: new Date(),
    });
    res.json(updated);
});
router.delete('/:id', (0, guard_1.guard)('proposals', 'delete'), async (req, res) => {
    const deleted = await Proposal_1.default.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'delete',
        resource: 'proposals',
        subjectId: req.params.id,
        createdAt: new Date(),
    });
    res.status(204).send();
});
exports.default = router;
