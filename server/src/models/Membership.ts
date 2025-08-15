import { Schema, model, Types } from 'mongoose';

export interface Membership {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

const MembershipSchema = new Schema<Membership>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

MembershipSchema.index({ tenantId: 1, userId: 1 });

export default model<Membership>('Membership', MembershipSchema);
