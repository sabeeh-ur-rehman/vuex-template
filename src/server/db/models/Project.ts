import { Schema, model, Types } from 'mongoose';

const jobNotesSchema = new Schema({
  proposalContractApprovalRFIs: { type: Boolean, default: false },
  allMatEquipSelectionsComplete: { type: Boolean, default: false },
  quotesFromOutsideResources: { type: Boolean, default: false },
  promisesToCustomer: { type: String, trim: true },
  access: { type: String, trim: true },
  supervisor: { type: String, trim: true },
  customerConcerns: { type: String, trim: true },
  certificationPlanning: { type: Boolean, default: false },
  within2Metres: { type: Boolean, default: false },
  budgetInformation: { type: String, trim: true },
  plansCheckedAndCorrect: { type: Boolean, default: false },
  optionsProvided: { type: Boolean, default: false },
}, { _id: false });

const councilSchema = new Schema({
  name: { type: String, trim: true },
  zone: { type: String, trim: true },
  adjustPct: { type: Number },
  isPropertySewered: { type: Boolean, default: false },
  insuranceClassification: { type: String, trim: true },
  lotNumber: { type: String, trim: true },
  depositedPlanNumber: { type: String, trim: true },
  siteArea: { type: Number },
}, { _id: false });

const projectSchema = new Schema({
  tenantId:   { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },
  customerId: { type: Types.ObjectId, ref: 'Customer', index: true, required: true },

  projectName: { type: String, required: true, trim: true },
  jobNo:       { type: String, index: true },
  issueNo:     { type: Number, default: 1 },

  jobType:  { type: String, required: true },
  spaType:  { type: String, required: true },
  veType:   { type: String, required: true },
  siteType: { type: String },

  repId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  clientRequestDate: { type: Date, required: true },

  siteAddress:  { type: String, required: true, trim: true },
  sitePostcode: { type: String, required: true, trim: true },
  council: councilSchema,

  jobNotes: jobNotesSchema,

  status: { type: String, enum: ['lead','active','won','lost','archived'], default: 'lead', index: true }
}, { timestamps: true });

projectSchema.index({ tenantId: 1, jobNo: 1 }, { unique: true, sparse: true });
export default model('Project', projectSchema);
