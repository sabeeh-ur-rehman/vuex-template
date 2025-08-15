import { Schema, model, Types } from 'mongoose';

export interface User {
  tenantId: Types.ObjectId;
  email: string;
}

const UserSchema = new Schema<User>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
});

UserSchema.index({ tenantId: 1, email: 1 });

export default model<User>('User', UserSchema);
