import { Schema, model, Types } from 'mongoose';

export interface Project {
  tenantId: Types.ObjectId;
  name: string;
}

const ProjectSchema = new Schema<Project>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

ProjectSchema.index({ tenantId: 1, name: 1 });

export default model<Project>('Project', ProjectSchema);
