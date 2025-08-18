import { Schema, model, Types } from 'mongoose';

export interface Proposal {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
  customerId: Types.ObjectId;
  priceListId?: Types.ObjectId;
  notes?: string;
  sections?: {
    id: number;
    title: string;
    complete: boolean;
    items: {
      id: number;
      name: string;
      qty: number;
      price: number;
      optional?: boolean;
      selected?: boolean;
    }[];
  }[];
  showPrices?: boolean;
  adjustment?: number;
  subtotal?: number;
  total?: number;
}

const ProposalSchema = new Schema<Proposal>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true },
  customerId: { type: Schema.Types.ObjectId, required: true },
  priceListId: { type: Schema.Types.ObjectId },
  notes: { type: String },
  sections: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      complete: { type: Boolean, required: true },
      items: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          qty: { type: Number, required: true },
          price: { type: Number, required: true },
          optional: { type: Boolean },
          selected: { type: Boolean },
        },
      ],
    },
  ],
  showPrices: { type: Boolean },
  adjustment: { type: Number },
  subtotal: { type: Number },
  total: { type: Number },
});

ProposalSchema.index({ tenantId: 1, projectId: 1 });

export default model<Proposal>('Proposal', ProposalSchema);
