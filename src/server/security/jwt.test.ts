import { describe, it, expect } from 'vitest';

describe('jwt utils', () => {
  it('signs and verifies token', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.APP_URL = 'http://localhost:3000';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRES = '1h';
    process.env.REFRESH_EXPIRES = '30d';
    const { signAccess, verifyAccess } = await import('./jwt');
    const token = signAccess({ sub: '1', tenantId: 't1', role: 'admin', name: 'Test', email: 't@example.com' });
    const payload = verifyAccess(token);
    expect(payload.email).toBe('t@example.com');
  });
});
