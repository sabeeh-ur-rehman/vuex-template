import { z } from 'zod';

const EnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES: z.string().default('1h'),
  REFRESH_EXPIRES: z.string().default('30d'),
  APP_URL: z.string().min(1),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional()
});

export const env = EnvSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  REFRESH_EXPIRES: process.env.REFRESH_EXPIRES,
  APP_URL: process.env.APP_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
});
