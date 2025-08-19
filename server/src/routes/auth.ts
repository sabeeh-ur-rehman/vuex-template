import { Router } from 'express';
import { signTenantToken } from '../auth/jwt';
import env from '../config/env';
import { connectMongo } from '../db/mongo';
import Tenant from '../models/Tenant';
import User from '../models/User';
import {
  hashPassword,
  verifyPassword,
} from '../../../src/server/security/crypto';
import {
  SelfRegisterSchema,
  LoginSchema,
} from '../../../src/server/validation/auth';

const router = Router();

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
 *             tenantCode: 'acme'
 *             email: 'user@example.com'
 *             password: 'secret123'
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
router.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  try {
    await connectMongo();
    const tenant = await Tenant.findOne({ code: parsed.data.tenantCode });
    if (!tenant) return res.status(401).json({ error: 'INVALID' });

    const user = await User.findOne({
      tenantId: tenant._id,
      email: parsed.data.email.toLowerCase(),
    });
    if (!user) return res.status(401).json({ error: 'INVALID' });

    const ok = await verifyPassword(
      parsed.data.password,
      user.passwordHash,
    );
    if (!ok) return res.status(401).json({ error: 'INVALID' });

    const token = signTenantToken(
      tenant._id.toString(),
      user._id.toString(),
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
