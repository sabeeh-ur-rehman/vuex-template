import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema({
  tenantId: { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin','rep','user'], default: 'user' },
  passwordHash: { type: String, required: true },
  repId: { type: Types.ObjectId },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export default model('User', userSchema);
