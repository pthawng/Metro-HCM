import Joi from 'joi';

/**
 * Progress Joi Schemas
 */

export const createProgressSchema = Joi.object({
  lineId: Joi.string().required(),
  date: Joi.date().default(Date.now),
  overallPercentage: Joi.number().min(0).max(100).required(),
  sections: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    percentage: Joi.number().min(0).max(100).required(),
    status: Joi.string().valid('planned', 'in-progress', 'completed', 'delayed').required(),
  })).optional(),
  status: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
}).options({ allowUnknown: false });

export const updateProgressSchema = Joi.object({
  date: Joi.date().optional(),
  overallPercentage: Joi.number().min(0).max(100).optional(),
  sections: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    percentage: Joi.number().min(0).max(100).required(),
    status: Joi.string().valid('planned', 'in-progress', 'completed', 'delayed').required(),
  })).optional(),
  status: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
}).min(1);
