import { Schema, model, Types } from 'mongoose';

const refreshTokenSchema = new Schema({
  tenantId: { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date }
}, { timestamps: true });

export default model('RefreshToken', refreshTokenSchema);
