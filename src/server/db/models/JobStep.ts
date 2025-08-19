import { Schema, model, Types } from 'mongoose';

const jobStepSchema = new Schema({
  tenantId:  { type: Types.ObjectId, ref: 'Tenant', index: true, required: true },
  projectId: { type: Types.ObjectId, ref: 'Project', index: true, required: true },

  stepNo:    { type: Number, required: true },
  description: { type: String, required: true },

  taskAssignDate: { type: Date },
  dueDate:        { type: Date },
  completedDate:  { type: Date },

  appointmentAt:  { type: Date },
  appointmentLocation: { type: String },

  reminderHours1: { type: Number },
  reminderHours2: { type: Number },
  reminderHours3: { type: Number },

  remindersEmailTxt: { type: String, trim: true }
}, { timestamps: true });

jobStepSchema.index({ tenantId: 1, projectId: 1, stepNo: 1 }, { unique: true });
export default model('JobStep', jobStepSchema);
