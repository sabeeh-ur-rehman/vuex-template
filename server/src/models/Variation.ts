import { Schema, model, Types } from 'mongoose';

export interface Variation {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
  proposalId: Types.ObjectId;
  name: string;
  status: string;
  items: {
    description: string;
    qty: number;
    price: number;
  }[];
}

const VariationSchema = new Schema<Variation>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true },
  proposalId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

VariationSchema.index({ tenantId: 1, projectId: 1 });
VariationSchema.index({ tenantId: 1, proposalId: 1 });

export default model<Variation>('Variation', VariationSchema);
