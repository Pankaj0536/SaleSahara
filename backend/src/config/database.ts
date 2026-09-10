import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let memoryServerInstance: any = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    logger.info(`Attempting connection to MongoDB at: ${env.MONGODB_URI}`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    logger.info('Connected to MongoDB successfully.');
  } catch (error: any) {
    logger.warn(`Failed to connect to standard MongoDB (${error.message}). Initializing MongoMemoryServer fallback for local execution...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri();
      await mongoose.connect(memUri);
      logger.info(`Connected to in-memory MongoDB successfully at: ${memUri}`);
    } catch (memError: any) {
      logger.error('Failed to initialize in-memory MongoDB fallback:', memError);
      throw memError;
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    logger.info('Disconnected from MongoDB.');
  } catch (error: any) {
    logger.error('Error disconnecting MongoDB:', error);
  }
};
