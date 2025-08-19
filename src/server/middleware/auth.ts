import { cookies } from 'next/headers';
import { verifyAccess } from '../security/jwt';

export const requireAuth = (roles?: ('admin'|'rep'|'user')[]) => {
  return () => {
    const token = cookies().get('access_token')?.value;
    if (!token) throw new Error('UNAUTHORIZED');
    const payload = verifyAccess(token);
    if (roles && !roles.includes(payload.role)) throw new Error('FORBIDDEN');
    return payload;
  };
};
