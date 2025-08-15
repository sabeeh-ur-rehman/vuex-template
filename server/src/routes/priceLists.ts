import { z } from 'zod';
import PriceList from '../models/PriceList';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

/**
 * @openapi
 * /price-lists:
 *   get:
 *     summary: List price lists.
 *   post:
 *     summary: Create a price list.
 * /price-lists/{id}:
 *   put:
 *     summary: Update a price list.
 *   delete:
 *     summary: Delete a price list.
 */
export default createTenantRouter('price-lists', PriceList, schema);
