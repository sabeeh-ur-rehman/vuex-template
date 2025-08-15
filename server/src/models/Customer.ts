import { Schema, model, Types } from 'mongoose';

export interface Customer {
  tenantId: Types.ObjectId;
  email: string;
}

const CustomerSchema = new Schema<Customer>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
});

CustomerSchema.index({ tenantId: 1, email: 1 });

export default model<Customer>('Customer', CustomerSchema);
