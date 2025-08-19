import { Router } from 'express';
import { z } from 'zod';
import { signTenantToken } from '../auth/jwt';
import env from '../config/env';
import { connectMongo } from '../db/mongo';
import Tenant from '../models/Tenant';
import User from '../models/User';
import { hashPassword } from '../../../src/server/security/crypto';
import { SelfRegisterSchema } from '../../../src/server/validation/auth';

const router = Router();

const loginSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
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
  const token = signTenantToken(parsed.data.tenantId, parsed.data.userId);
  res.json({ token });
});

router.post('/self-register', async (req, res) => {
  if (env.allowSelfRegister !== 'true') {
    return res
      .status(403)
      .json({ code: 'DISABLED', message: 'Self register disabled' });
  }

  const parsed = SelfRegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  try {
    await connectMongo();
    const tenant = await Tenant.findOne({ code: parsed.data.tenantCode });
    if (!tenant) return res.status(404).json({ code: 'TENANT_NOT_FOUND' });

    const exists = await User.findOne({
      tenantId: tenant._id,
      email: parsed.data.email.toLowerCase(),
    });
    if (exists) return res.status(409).json({ code: 'EMAIL_EXISTS' });

    const passwordHash = await hashPassword(parsed.data.password);
    const isFirstUser =
      (await User.countDocuments({ tenantId: tenant._id })) === 0;

    const user = await User.create({
      tenantId: tenant._id,
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      role: isFirstUser ? 'admin' : 'rep',
      passwordHash,
      isActive: true,
    });

    res.json({ ok: true, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
