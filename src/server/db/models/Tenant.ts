import { Schema, model } from 'mongoose';

const tenantSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Tenant', tenantSchema);
