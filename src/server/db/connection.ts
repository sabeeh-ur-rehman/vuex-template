import mongoose from 'mongoose';
import { env } from '../config/env';

let conn: typeof mongoose | null = null;

export const connectDb = async () => {
  if (conn) return conn;
  conn = await mongoose.connect(env.MONGODB_URI);
  return conn;
};
