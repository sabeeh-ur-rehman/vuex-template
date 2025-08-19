import { Schema, model, Types } from 'mongoose';

const passwordResetSchema = new Schema({
  tenantId: { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date },
}, { timestamps: true });

export default model('PasswordReset', passwordResetSchema);
