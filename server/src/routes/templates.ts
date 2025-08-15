import { z } from 'zod';
import Document from '../models/Document';
import { createTenantRouter } from './crud';

const schema = z.object({
  title: z.string(),
});

/**
 * @openapi
 * /templates:
 *   get:
 *     summary: List templates.
 *   post:
 *     summary: Create a template.
 * /templates/{id}:
 *   put:
 *     summary: Update a template.
 *   delete:
 *     summary: Delete a template.
 */
export default createTenantRouter('templates', Document, schema);
