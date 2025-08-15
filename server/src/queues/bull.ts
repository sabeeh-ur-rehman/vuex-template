import Bull from 'bull';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new Redis(redisUrl);

export const reminderQueue = new Bull('reminder', {
  createClient: () => connection,
});

export const pdfQueue = new Bull('pdf', {
  createClient: () => connection,
});

export const emailQueue = new Bull('email', {
  createClient: () => connection,
});
