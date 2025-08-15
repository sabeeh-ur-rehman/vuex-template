import { Schema, model, Types } from 'mongoose';

export interface AuditLog {
  tenantId: Types.ObjectId;
  createdAt: Date;
}

const AuditLogSchema = new Schema<AuditLog>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
});

AuditLogSchema.index({ tenantId: 1, createdAt: 1 });

export default model<AuditLog>('AuditLog', AuditLogSchema);
