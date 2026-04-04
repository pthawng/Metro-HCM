import rateLimit from 'express-rate-limit';
import AppError from '../core/error/AppError.js';

/**
 * Rate Limit Middleware Factory
 * 
 * @param {number} windowMinutes - Time window in minutes
 * @param {number} maxRequests - Max requests allowed per window
 * @param {string} message - Custom error message
 */
const createRateLimiter = (windowMinutes = 15, maxRequests = 100, message) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: {
      success: false,
      status: 'fail',
      message: message || `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${windowMinutes} phút.`,
    },
    handler: (req, res, next, options) => {
      next(new AppError(options.message.message, 429));
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export default createRateLimiter;
