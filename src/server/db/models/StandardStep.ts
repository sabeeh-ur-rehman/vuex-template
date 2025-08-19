import { Schema, model, Types } from 'mongoose';

const standardStepSchema = new Schema({
  tenantId: { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },
  stepNo:   { type: Number, required: true },
  description: { type: String, required: true },
  hasAppointment: { type: Boolean, default: false },
  reminderHours1: { type: Number, default: 24 },
  reminderHours2: { type: Number, default: 0 },
  reminderHours3: { type: Number, default: -24 },
  remindersEmailSmsMob: { type: String, trim: true },
  reminderSubject: { type: String, trim: true },
  reminderBody:    { type: String, trim: true },
}, { timestamps: true });

standardStepSchema.index({ tenantId: 1, stepNo: 1 }, { unique: true });
export default model('StandardStep', standardStepSchema);
