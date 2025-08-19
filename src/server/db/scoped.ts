import { Types } from 'mongoose';

export const toObjectId = (s: string) => new Types.ObjectId(s);
export const tenantFilter = (tenantId: string) => ({ tenantId: toObjectId(tenantId) });
