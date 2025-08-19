import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type Role = 'admin' | 'rep' | 'user';
export type JwtPayload = { sub: string; tenantId: string; role: Role; name: string; email: string; };

export const signAccess = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });

export const verifyAccess = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;
