import { z } from 'zod';
import EmailMsg from '../models/EmailMsg';
import { createTenantRouter } from './crud';

const schema = z.object({
  messageId: z.string(),
});

export default createTenantRouter('emails', EmailMsg, schema);
