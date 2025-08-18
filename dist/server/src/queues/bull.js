"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.pdfQueue = exports.reminderQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new ioredis_1.default(redisUrl);
exports.reminderQueue = new bull_1.default('reminder', {
    createClient: () => connection,
});
exports.pdfQueue = new bull_1.default('pdf', {
    createClient: () => connection,
});
exports.emailQueue = new bull_1.default('email', {
    createClient: () => connection,
});
