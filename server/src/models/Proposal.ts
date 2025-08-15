import { Schema, model, Types } from 'mongoose';

export interface Proposal {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
  customerId: Types.ObjectId;
  priceListId?: Types.ObjectId;
  notes?: string;
  items?: {
    description: string;
    quantity?: number;
    unitPrice: number;
  }[];
  total?: number;
}

const ProposalSchema = new Schema<Proposal>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true },
  customerId: { type: Schema.Types.ObjectId, required: true },
  priceListId: { type: Schema.Types.ObjectId },
  notes: { type: String },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number },
      unitPrice: { type: Number, required: true },
    },
  ],
  total: { type: Number },
});

ProposalSchema.index({ tenantId: 1, projectId: 1 });

export default model<Proposal>('Proposal', ProposalSchema);
