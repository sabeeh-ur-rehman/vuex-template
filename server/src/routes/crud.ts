import { Router } from 'express';
import { Model } from 'mongoose';
import { ZodObject } from 'zod';
import { guard, AuthenticatedRequest } from '../auth/guard';
import AuditLog from '../models/AuditLog';

export function createTenantRouter(
  resource: string,
  model: Model<any>,
  schema: ZodObject<any>
) {
  const router = Router();

  router.get('/', guard(resource, 'read'), async (req: AuthenticatedRequest, res) => {
    const items = await model.find({ tenantId: req.tenantId }).lean();
    res.json(items);
  });

  router.post('/', guard(resource, 'create'), async (req: AuthenticatedRequest, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.flatten());
    }
    const created = await model.create({ ...parsed.data, tenantId: req.tenantId });
    await AuditLog.create({ tenantId: req.tenantId!, createdAt: new Date() });
    res.status(201).json(created);
  });

  router.put('/:id', guard(resource, 'update'), async (req: AuthenticatedRequest, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.flatten());
    }
    const updated = await model.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      parsed.data,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog.create({ tenantId: req.tenantId!, createdAt: new Date() });
    res.json(updated);
  });

  router.delete('/:id', guard(resource, 'delete'), async (req: AuthenticatedRequest, res) => {
    const deleted = await model.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    await AuditLog.create({ tenantId: req.tenantId!, createdAt: new Date() });
    res.status(204).send();
  });

  return router;
}
