import { z } from 'zod';
import Document from '../models/Document';
import { createTenantRouter } from './crud';

const schema = z.object({
  title: z.string(),
});

export default createTenantRouter('templates', Document, schema);
