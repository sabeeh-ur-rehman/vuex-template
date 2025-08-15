import mongoose from 'mongoose';
import env from '../config/env';

let connection: typeof mongoose | null = null;

export async function connectMongo(): Promise<typeof mongoose> {
  if (!connection) {
    const uri = env.mongoUri || 'mongodb://localhost:27017/test';
    connection = await mongoose.connect(uri);
  }

  return connection;
}

export default connectMongo;
