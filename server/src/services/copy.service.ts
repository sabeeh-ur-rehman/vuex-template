import { Model } from 'mongoose';

/**
 * Duplicate a document by id optionally overriding fields.
 */
export async function copyDocument<T extends { _id: any }>(
  model: Model<T>,
  id: string,
  overrides: Partial<T> = {}
): Promise<T | null> {
  const doc = await model.findById(id).lean();
  if (!doc) return null;
  const { _id, ...rest } = doc as any;
  const created = await model.create({ ...(rest as any), ...overrides });
  return created.toObject();
}
