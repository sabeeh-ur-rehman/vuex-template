import { Schema, model, Types } from 'mongoose';

export interface Document {
  tenantId: Types.ObjectId;
  title: string;
}

const DocumentSchema = new Schema<Document>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
});

DocumentSchema.index({ tenantId: 1, title: 1 });

export default model<Document>('Document', DocumentSchema);
