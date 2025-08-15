import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import router from './routes';
import swaggerUi from 'swagger-ui-express';
import spec from './src/config/swagger';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUrl);
    console.log('Mongo connected');

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redis = new Redis(redisUrl);
    redis.on('connect', () => console.log('Redis connected'));
    redis.on('error', err => console.error('Redis error', err));

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
    app.use('/api', router);

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

bootstrap();
