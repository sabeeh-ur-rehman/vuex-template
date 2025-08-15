import { Schema, model, Types } from 'mongoose';

export interface PriceList {
  tenantId: Types.ObjectId;
  name: string;
  description?: string;
  items?: {
    name: string;
    unit?: string;
    price: number;
    description?: string;
  }[];
}

const PriceListSchema = new Schema<PriceList>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String },
  items: [
    {
      name: { type: String, required: true },
      unit: { type: String },
      price: { type: Number, required: true },
      description: { type: String },
    },
  ],
});

PriceListSchema.index({ tenantId: 1, name: 1 });

export default model<PriceList>('PriceList', PriceListSchema);
