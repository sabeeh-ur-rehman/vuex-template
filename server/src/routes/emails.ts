import { z } from 'zod';
import EmailMsg from '../models/EmailMsg';
import { createTenantRouter } from './crud';

const schema = z.object({
  messageId: z.string(),
});

/**
 * @openapi
 * /emails:
 *   get:
 *     summary: List email messages.
 *   post:
 *     summary: Create an email message.
 * /emails/{id}:
 *   put:
 *     summary: Update an email message.
 *   delete:
 *     summary: Delete an email message.
 */
export default createTenantRouter('emails', EmailMsg, schema);
