import { Schema, model, Types } from 'mongoose';

export interface User {
  tenantId: Types.ObjectId;
  email: string;
  name: string;
  role: 'admin' | 'rep' | 'user';
  passwordHash: string;
  repId?: Types.ObjectId;
  isActive: boolean;
}

const UserSchema = new Schema<User>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    email: { type: String, required: true, lowercase: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'rep', 'user'], default: 'user' },
    passwordHash: { type: String, required: true },
    repId: { type: Schema.Types.ObjectId },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export default model<User>('User', UserSchema);
