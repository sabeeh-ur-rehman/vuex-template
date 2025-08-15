import { Schema, model, Types } from 'mongoose';

export interface EmailMsg {
  tenantId: Types.ObjectId;
  messageId: string;
}

const EmailMsgSchema = new Schema<EmailMsg>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  messageId: { type: String, required: true },
});

EmailMsgSchema.index({ tenantId: 1, messageId: 1 });

export default model<EmailMsg>('EmailMsg', EmailMsgSchema);
