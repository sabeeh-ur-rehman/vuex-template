import ProposalModel, { Proposal } from '../models/Proposal';
import { Types } from 'mongoose';

export async function createProposal(data: {
  tenantId: Types.ObjectId;
  projectId: Types.ObjectId;
}): Promise<Proposal> {
  const created = await ProposalModel.create(data);
  return created.toObject();
}

export async function getProposal(
  id: string,
  tenantId: Types.ObjectId
): Promise<Proposal | null> {
  return ProposalModel.findOne({ _id: id, tenantId }).lean();
}

export async function updateProposal(
  id: string,
  tenantId: Types.ObjectId,
  update: Partial<Proposal>
): Promise<Proposal | null> {
  return ProposalModel.findOneAndUpdate({ _id: id, tenantId }, update, {
    new: true,
  }).lean();
}

export async function listProposals(tenantId: Types.ObjectId): Promise<Proposal[]> {
  return ProposalModel.find({ tenantId }).lean();
}

export async function deleteProposal(
  id: string,
  tenantId: Types.ObjectId
): Promise<boolean> {
  const res = await ProposalModel.deleteOne({ _id: id, tenantId });
  return res.deletedCount === 1;
}
