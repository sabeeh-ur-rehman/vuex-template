import { z } from 'zod';
import Step from '../models/Step';
import { createTenantRouter } from './crud';

const schema = z.object({
  projectId: z.string(),
});

/**
 * @openapi
 * /steps:
 *   get:
 *     summary: List steps.
 *   post:
 *     summary: Create a step.
 * /steps/{id}:
 *   put:
 *     summary: Update a step.
 *   delete:
 *     summary: Delete a step.
 */
export default createTenantRouter('steps', Step, schema);
