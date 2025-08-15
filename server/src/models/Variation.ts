import { Schema, model, Types } from 'mongoose';

export interface Variation {
  tenantId: Types.ObjectId;
  proposalId: Types.ObjectId;
}

const VariationSchema = new Schema<Variation>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  proposalId: { type: Schema.Types.ObjectId, required: true },
});

VariationSchema.index({ tenantId: 1, proposalId: 1 });

export default model<Variation>('Variation', VariationSchema);
