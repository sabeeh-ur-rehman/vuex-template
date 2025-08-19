import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './crypto';

describe('crypto utils', () => {
  it('hashes and verifies password', async () => {
    const hash = await hashPassword('password123');
    const valid = await verifyPassword('password123', hash);
    expect(valid).toBe(true);
  });
});
