import { Request, Response, NextFunction, RequestHandler } from 'express';
import Membership from '../models/Membership';
import { verifyTenantToken } from './jwt';
import { can, Action, Resource } from '../utils/rbac';

export interface AuthenticatedRequest extends Request {
  membership?: import('../models/Membership').Membership;
  userId?: string;
  tenantId?: string;
}

export function guard(resource: Resource, action: Action): RequestHandler {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const payload = verifyTenantToken(token);
      req.userId = payload.sub;
      req.tenantId = payload.tenantId;

      const membership = await Membership.findOne({
        tenantId: payload.tenantId,
        userId: payload.sub
      }).lean();

      if (!membership) {
        return res.status(403).json({ message: 'Membership required' });
      }

      req.membership = membership;

      if (!can(membership.role, action, resource)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
