import { Schema, model, Types } from 'mongoose';

export interface SummerTime {
  tenantId: Types.ObjectId;
  year: number;
}

const SummerTimeSchema = new Schema<SummerTime>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  year: { type: Number, required: true },
});

SummerTimeSchema.index({ tenantId: 1, year: 1 });

export default model<SummerTime>('SummerTime', SummerTimeSchema);
