"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProposal = createProposal;
exports.getProposal = getProposal;
exports.updateProposal = updateProposal;
exports.listProposals = listProposals;
exports.deleteProposal = deleteProposal;
const Proposal_1 = __importDefault(require("../models/Proposal"));
async function createProposal(data) {
    const created = await Proposal_1.default.create(data);
    return created.toObject();
}
async function getProposal(id, tenantId) {
    return Proposal_1.default.findOne({ _id: id, tenantId }).lean();
}
async function updateProposal(id, tenantId, update) {
    return Proposal_1.default.findOneAndUpdate({ _id: id, tenantId }, update, {
        new: true,
    }).lean();
}
async function listProposals(tenantId) {
    return Proposal_1.default.find({ tenantId }).lean();
}
async function deleteProposal(id, tenantId) {
    const res = await Proposal_1.default.deleteOne({ _id: id, tenantId });
    return res.deletedCount === 1;
}
