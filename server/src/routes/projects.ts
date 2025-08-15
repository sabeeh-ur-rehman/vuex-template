import { z } from 'zod';
import Project from '../models/Project';
import { createTenantRouter } from './crud';

const schema = z.object({
  name: z.string(),
});

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: List projects.
 *   post:
 *     summary: Create a project.
 * /projects/{id}:
 *   put:
 *     summary: Update a project.
 *   delete:
 *     summary: Delete a project.
 */
export default createTenantRouter('projects', Project, schema);
