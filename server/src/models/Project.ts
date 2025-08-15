import { Schema, model, Types } from 'mongoose';

export interface Project {
  tenantId: Types.ObjectId;
  customerId?: Types.ObjectId;
  name: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const ProjectSchema = new Schema<Project>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  customerId: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
});

ProjectSchema.index({ tenantId: 1, name: 1 });

export default model<Project>('Project', ProjectSchema);
