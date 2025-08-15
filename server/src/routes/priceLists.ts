import { z } from 'zod';
import PriceList from '../models/PriceList';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

export default createTenantRouter('price-lists', PriceList, schema);
