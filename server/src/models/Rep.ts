import { Schema, model, Types } from 'mongoose';

export interface Rep {
  tenantId: Types.ObjectId;
  email: string;
}

const RepSchema = new Schema<Rep>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
});

RepSchema.index({ tenantId: 1, email: 1 });

export default model<Rep>('Rep', RepSchema);
