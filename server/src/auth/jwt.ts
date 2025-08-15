import jwt from 'jsonwebtoken';
import env from '../config/env';

export interface TenantTokenPayload extends jwt.JwtPayload {
  tenantId: string;
  sub: string; // user id
}

const secret = env.jwtSecret || 'secret';

export function signTenantToken(
  tenantId: string,
  userId: string,
  expiresIn: string | number = '1h'
): string {
  return jwt.sign({ tenantId }, secret, { subject: userId, expiresIn });
}

export function verifyTenantToken(token: string): TenantTokenPayload {
  return jwt.verify(token, secret) as TenantTokenPayload;
}
