"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const jwt_1 = require("../auth/jwt");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    tenantId: zod_1.z.string(),
    userId: zod_1.z.string(),
});
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user and return a tenant token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             userId: '507f1f77bcf86cd799439012'
 *     responses:
 *       '200':
 *         description: JWT token returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *             example:
 *               token: 'jwt.token.example'
 */
router.post('/login', (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const token = (0, jwt_1.signTenantToken)(parsed.data.tenantId, parsed.data.userId);
    res.json({ token });
});
exports.default = router;
