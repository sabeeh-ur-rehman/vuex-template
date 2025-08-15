import { Schema, model, Types } from 'mongoose';

export interface PriceList {
  tenantId: Types.ObjectId;
  name: string;
}

const PriceListSchema = new Schema<PriceList>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

PriceListSchema.index({ tenantId: 1, name: 1 });

export default model<PriceList>('PriceList', PriceListSchema);
