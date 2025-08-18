import PriceListModel, { PriceList } from '../models/PriceList';
import { Types } from 'mongoose';

export async function createPriceList(
  tenantId: Types.ObjectId,
  name: string,
  description?: string,
  items?: PriceList['items']
): Promise<PriceList> {
  const created = await PriceListModel.create({ tenantId, name, description, items });
  return created.toObject();
}

export async function listPriceLists(
  tenantId: Types.ObjectId
): Promise<PriceList[]> {
  return PriceListModel.find({ tenantId }).lean();
}

export async function updatePriceList(
  id: string,
  tenantId: Types.ObjectId,
  data: Partial<Pick<PriceList, 'name' | 'description' | 'items'>>
): Promise<PriceList | null> {
  return PriceListModel.findOneAndUpdate({ _id: id, tenantId }, data, { new: true }).lean();
}

