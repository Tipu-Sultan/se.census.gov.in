import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/census_india_2027';

interface Cached { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; }
declare global { var __mongoose: Cached | undefined; }

const cached: Cached = global.__mongoose ?? { conn: null, promise: null };
if (!global.__mongoose) global.__mongoose = cached;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch {
    cached.promise = null;
    return null;
  }
}

export default connectDB;
