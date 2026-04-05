import { createClient } from 'redis';
import logger from '../logger/logger.js';
import config from '../config/config.js';

let redisClient = null;

/**
 * Initialize Redis Client 
 * (Staff-level optimization: Distributed Shared Cache)
 */
export const initRedis = async () => {
    if (redisClient) return redisClient;

    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({ url });

    redisClient.on('error', (err) => {
        logger.error('💥 Redis Client Error:', { error: err.message });
    });

    redisClient.on('connect', () => {
        logger.info('🚀 Redis Connected successfully');
    });

    try {
        await redisClient.connect();
        return redisClient;
    } catch (err) {
        logger.error('❌ Redis Connection Failed:', { error: err.message });
        return null; // Fallback to L1-only mode
    }
};

export const getRedisClient = () => redisClient;

export default redisClient;
