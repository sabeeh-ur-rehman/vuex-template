import { Schema, model, Types } from 'mongoose';

export interface Step {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
  name: string;
  description?: string;
  order?: number;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

const StepSchema = new Schema<Step>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

StepSchema.index({ tenantId: 1, projectId: 1, order: 1 });

export default model<Step>('Step', StepSchema);
