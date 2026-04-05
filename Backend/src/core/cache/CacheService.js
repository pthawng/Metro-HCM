import { getRedisClient } from './redis.js';
import logger from '../logger/logger.js';
import * as Metrics from '../metrics/metrics.js';

/**
 * L1 (Local Memory) Cache 
 * (Staff-level optimization: Ultra-low latency)
 */
const l1Cache = new Map();

/**
 * Cache Service - L1/L2 orchestration. 
 * Implements Fallback to L1 if L2 (Redis) is unavailable.
 */
export const get = async (key) => {
    // Check L1
    if (l1Cache.has(key)) {
        const item = l1Cache.get(key);
        if (item.expiry > Date.now()) {
            Metrics.cacheHits.inc({ layer: 'l1' });
            logger.debug(`⚡ [L1 Cache HIT] ${key}`);
            return item.value;
        }
        l1Cache.delete(key);
    }

    // Check L2 (Redis)
    const redis = getRedisClient();
    if (redis && redis.isOpen) {
        try {
            const data = await redis.get(key);
            if (data) {
                const parsed = JSON.parse(data);
                Metrics.cacheHits.inc({ layer: 'l2' });
                // Backfill L1
                l1Cache.set(key, { value: parsed, expiry: Date.now() + 60000 }); // Default 60s
                logger.debug(`🌀 [L2 Cache HIT] ${key}`);
                return parsed;
            }
        } catch (err) {
            logger.error('❌ Redis Get Error:', { error: err.message });
        }
    }

    return null;
};

export const set = async (key, value, ttl = 300) => {
    // Set L1 (60s default)
    l1Cache.set(key, { value, expiry: Date.now() + 60000 });

    // Set L2 (Redis)
    const redis = getRedisClient();
    if (redis && redis.isOpen) {
        try {
            await redis.set(key, JSON.stringify(value), { EX: ttl });
        } catch (err) {
            logger.error('❌ Redis Set Error:', { error: err.message });
        }
    }
};

/**
 * Clear L1 cache (Shared state is handled by versioning, so L1 only)
 */
export const clearL1 = () => {
    l1Cache.clear();
    logger.info('🧹 L1 Cache Cleared');
};
