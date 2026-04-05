import logger from '../../core/logger/logger.js';

/**
 * Staff-level Retry Helper with Exponential Backoff.
 * Used for transient failures in 3rd party APIs (VNPay/Twilio) or DB locks.
 * 
 * @param {Function} fn - The async function to retry
 * @param {Object} options - { maxRetries, delay, factor }
 */
export const withRetry = async (fn, options = {}) => {
    const { 
        maxRetries = 3, 
        initialDelay = 1000, 
        factor = 2,
        onRetry = null 
    } = options;

    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            
            // If it's a known non-retryable error (e.g. 400 Bad Request), throw immediately
            if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
                throw err;
            }

            if (attempt === maxRetries) break;

            const delay = initialDelay * Math.pow(factor, attempt - 1);
            logger.warn(`⚠️ [Retry Attempt ${attempt}/${maxRetries}] failed. Retrying in ${delay}ms...`, {
                error: err.message
            });

            if (onRetry) onRetry(err, attempt);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
};
