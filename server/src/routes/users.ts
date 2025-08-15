import { z } from 'zod';
import User from '../models/User';
import { createTenantRouter } from './crud';

const schema = z.object({
  email: z.string().email(),
});

export default createTenantRouter('users', User, schema);
