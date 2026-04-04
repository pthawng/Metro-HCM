import Joi from 'joi';

/**
 * Feedback Joi Schemas
 */

export const createFeedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).optional(),
  source: Joi.string().valid('app', 'website', 'mobile', 'kiosk', 'customer-service', 'other').required(),
  userEmail: Joi.string().email().optional(),
  userName: Joi.string().optional(),
}).options({ allowUnknown: false });

export const updateFeedbackSchema = Joi.object({
  status: Joi.string().valid('new', 'reviewed', 'resolved', 'archived').optional(),
  response: Joi.string().trim().optional(),
}).options({ allowUnknown: false });
