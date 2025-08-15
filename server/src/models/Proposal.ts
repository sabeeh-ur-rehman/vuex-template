import { Schema, model, Types } from 'mongoose';

export interface Proposal {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
}

const ProposalSchema = new Schema<Proposal>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true },
});

ProposalSchema.index({ tenantId: 1, projectId: 1 });

export default model<Proposal>('Proposal', ProposalSchema);
