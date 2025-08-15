import 'dotenv/config';

const storagePrefix = 'STORAGE_';
const storageEntries = Object.entries(process.env).filter(([key]) =>
  key.startsWith(storagePrefix)
);

const storage = Object.fromEntries(storageEntries) as Record<string, string | undefined>;

export interface EnvConfig {
  mongoUri: string | undefined;
  redisUrl: string | undefined;
  jwtSecret: string | undefined;
  emailProvider: string | undefined;
  storage: Record<string, string | undefined>;
  baseUrl: string | undefined;
  tenantDefaultTimezone: string | undefined;
}

const config: EnvConfig = {
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  emailProvider: process.env.EMAIL_PROVIDER,
  storage,
  baseUrl: process.env.BASE_URL,
  tenantDefaultTimezone: process.env.TENANT_DEFAULT_TIMEZONE
};

export default config;
