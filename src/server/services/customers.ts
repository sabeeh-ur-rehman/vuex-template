import Customer from '../db/models/Customer';
import { CustomerSchema } from '../validation/crm';

interface EnsureCustomerParams {
  tenantId: string;
  customerId?: string;
  newCustomer?: any;
}

/**
 * Ensures a customer exists for given params. Returns customerId.
 */
export async function ensureCustomer({ tenantId, customerId, newCustomer }: EnsureCustomerParams): Promise<string> {
  if (customerId) {
    return customerId;
  }
  if (!newCustomer) {
    throw new Error('customerId or newCustomer required');
  }
  const parsed = CustomerSchema.parse(newCustomer);
  const doc = await Customer.create({ ...parsed, tenantId });
  return doc._id.toString();
}
