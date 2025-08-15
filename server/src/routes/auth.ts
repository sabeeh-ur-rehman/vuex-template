import { Router } from 'express';
import { z } from 'zod';
import { signTenantToken } from '../auth/jwt';

const router = Router();

const loginSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
});

router.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  const token = signTenantToken(parsed.data.tenantId, parsed.data.userId);
  res.json({ token });
});

export default router;
