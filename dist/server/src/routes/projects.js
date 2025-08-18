"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Project_1 = __importDefault(require("../models/Project"));
const guard_1 = require("../auth/guard");
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const router = (0, express_1.Router)();
const schema = zod_1.z.object({
    name: zod_1.z.string(),
});
/**
 * @openapi
 * /projects:
 *   get:
 *     summary: List projects
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: A paginated list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *   post:
 *     summary: Create a project
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       '201':
 *         description: Created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 * /projects/{id}:
 *   get:
 *     summary: Get a project by id
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       '404':
 *         description: Not found
 *   put:
 *     summary: Update a project
 *     tags:
 *       - Projects
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
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       '200':
 *         description: Updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       '404':
 *         description: Not found
 *   delete:
 *     summary: Delete a project
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Project deleted
 *       '404':
 *         description: Not found
 */
router.get('/', (0, guard_1.guard)('projects', 'read'), async (req, res) => {
    var _a, _b;
    const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : '1', 10);
    const limit = parseInt((_b = req.query.limit) !== null && _b !== void 0 ? _b : '20', 10);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Project_1.default.find({ tenantId: req.tenantId }).skip(skip).limit(limit).lean(),
        Project_1.default.countDocuments({ tenantId: req.tenantId }),
    ]);
    res.json({ items, total, page });
});
router.get('/:id', (0, guard_1.guard)('projects', 'read'), async (req, res) => {
    const project = await Project_1.default.findOne({ _id: req.params.id, tenantId: req.tenantId }).lean();
    if (!project) {
        return res.status(404).json({ message: 'Not found' });
    }
    res.json(project);
});
router.post('/', (0, guard_1.guard)('projects', 'create'), async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const created = await Project_1.default.create({ ...parsed.data, tenantId: req.tenantId });
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'create',
        resource: 'projects',
        subjectId: created._id,
        createdAt: new Date(),
    });
    res.status(201).json(created);
});
router.put('/:id', (0, guard_1.guard)('projects', 'update'), async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const updated = await Project_1.default.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, parsed.data, { new: true });
    if (!updated) {
        return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'update',
        resource: 'projects',
        subjectId: req.params.id,
        createdAt: new Date(),
    });
    res.json(updated);
});
router.delete('/:id', (0, guard_1.guard)('projects', 'delete'), async (req, res) => {
    const deleted = await Project_1.default.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog_1.default.create({
        tenantId: req.tenantId,
        action: 'delete',
        resource: 'projects',
        subjectId: req.params.id,
        createdAt: new Date(),
    });
    res.status(204).send();
});
exports.default = router;
