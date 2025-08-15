import PriceListModel, { PriceList } from '../models/PriceList';
import { Types } from 'mongoose';

export async function createPriceList(
  tenantId: Types.ObjectId,
  name: string
): Promise<PriceList> {
  const created = await PriceListModel.create({ tenantId, name });
  return created.toObject();
}

export async function listPriceLists(
  tenantId: Types.ObjectId
): Promise<PriceList[]> {
  return PriceListModel.find({ tenantId }).lean();
}

export async function renamePriceList(
  id: string,
  tenantId: Types.ObjectId,
  name: string
): Promise<PriceList | null> {
  return PriceListModel.findOneAndUpdate(
    { _id: id, tenantId },
    { name },
    { new: true }
  ).lean();
}
