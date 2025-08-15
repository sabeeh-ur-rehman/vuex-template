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
 *     responses:
 *       '200':
 *         description: Price lists fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceList'
 *             example:
 *               - tenantId: '507f1f77bcf86cd799439011'
 *                 name: 'Standard'
 *   post:
 *     summary: Create a price list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriceList'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Standard'
 *     responses:
 *       '200':
 *         description: Price list created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Standard'
 * /price-lists/{id}:
 *   put:
 *     summary: Update a price list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriceList'
 *           example:
 *             tenantId: '507f1f77bcf86cd799439011'
 *             name: 'Updated list'
 *     responses:
 *       '200':
 *         description: Price list updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 *             example:
 *               tenantId: '507f1f77bcf86cd799439011'
 *               name: 'Updated list'
 *   delete:
 *     summary: Delete a price list.
 *     responses:
 *       '200':
 *         description: Price list deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default createTenantRouter('price-lists', PriceList, schema);
