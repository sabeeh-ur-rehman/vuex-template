import { Schema, model, Types } from 'mongoose';
import { Role } from '../utils/rbac';

export interface Membership {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  role: Role;
}

const MembershipSchema = new Schema<Membership>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  role: { type: String, required: true, enum: ['admin', 'member'] },
});

MembershipSchema.index({ tenantId: 1, userId: 1 });

export default model<Membership>('Membership', MembershipSchema);
