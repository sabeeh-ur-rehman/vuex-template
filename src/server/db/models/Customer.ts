import { Schema, model, Types } from 'mongoose';
import { ContactSchema } from './common/Contact';

const customerSchema = new Schema({
  tenantId: { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },

  customerNo: { type: String, index: true },
  customerName: { type: String, required: true, trim: true },

  contact: ContactSchema,

  siteAddress:   { type: String, trim: true },
  sitePostcode:  { type: String, trim: true },
}, { timestamps: true });

customerSchema.index({ tenantId: 1, customerName: 1 });
export default model('Customer', customerSchema);
