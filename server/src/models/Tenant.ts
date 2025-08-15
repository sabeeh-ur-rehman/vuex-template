import { Schema, model, Types } from 'mongoose';

export interface Tenant {
  tenantId: Types.ObjectId;
  name: string;
}

const TenantSchema = new Schema<Tenant>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

TenantSchema.index({ tenantId: 1, name: 1 });

export default model<Tenant>('Tenant', TenantSchema);
