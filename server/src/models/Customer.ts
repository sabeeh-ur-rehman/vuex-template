import { Schema, model, Types } from 'mongoose';

export interface Customer {
  tenantId: Types.ObjectId;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const CustomerSchema = new Schema<Customer>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
});

CustomerSchema.index({ tenantId: 1, email: 1 });

export default model<Customer>('Customer', CustomerSchema);
