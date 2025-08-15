import { Schema, model, Types } from 'mongoose';

export interface Step {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
}

const StepSchema = new Schema<Step>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true },
});

StepSchema.index({ tenantId: 1, projectId: 1 });

export default model<Step>('Step', StepSchema);
