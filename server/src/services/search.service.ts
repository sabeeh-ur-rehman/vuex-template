import { Model } from 'mongoose';

/**
 * Generic text search on a Mongoose model using the $text operator.
 */
export async function textSearch<T>(
  model: Model<T>,
  tenantId: any,
  query: string
): Promise<any[]> {
  const filter = { tenantId, $text: { $search: query } } as any;
  return model.find(filter).lean();
}
