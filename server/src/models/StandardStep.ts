import { Schema, model, Types } from 'mongoose';

export interface StandardStep {
  tenantId: Types.ObjectId;
  name: string;
}

const StandardStepSchema = new Schema<StandardStep>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

StandardStepSchema.index({ tenantId: 1, name: 1 });

export default model<StandardStep>('StandardStep', StandardStepSchema);
