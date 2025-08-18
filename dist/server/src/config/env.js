"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const storagePrefix = 'STORAGE_';
const storageEntries = Object.entries(process.env).filter(([key]) => key.startsWith(storagePrefix));
const storage = Object.fromEntries(storageEntries);
const config = {
    mongoUri: process.env.MONGO_URI,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    emailProvider: process.env.EMAIL_PROVIDER,
    storage,
    baseUrl: process.env.BASE_URL,
    tenantDefaultTimezone: process.env.TENANT_DEFAULT_TIMEZONE
};
exports.default = config;
