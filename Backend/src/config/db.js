import mongoose from 'mongoose';
import config from '../core/config/config.js';
import logger from '../core/logger/logger.js';

/**
 * MongoDB Connection Logic
 * Uses the centralized config and logger.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', { error: error.message });
    // In production, we might want to let the process stay alive for retries
    // But for a clear "fail-fast" at startup, exiting is often preferred.
    process.exit(1);
  }
};

export default connectDB;
