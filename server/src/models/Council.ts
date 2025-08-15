import { Schema, model, Types } from 'mongoose';

export interface Council {
  tenantId: Types.ObjectId;
  name: string;
}

const CouncilSchema = new Schema<Council>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

CouncilSchema.index({ tenantId: 1, name: 1 });

export default model<Council>('Council', CouncilSchema);
