import Joi from 'joi';

/**
 * News Joi Schemas
 */

export const createNewsSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  content: Joi.string().trim().min(20).required(),
  category: Joi.string().valid('news', 'announcement', 'event', 'promotion', 'update', 'other').required(),
  image: Joi.string().uri().allow('', null).optional(),
  author: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isImportant: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  date: Joi.date().default(Date.now),
}).options({ allowUnknown: false });

export const updateNewsSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).optional(),
  content: Joi.string().trim().min(20).optional(),
  category: Joi.string().valid('news', 'announcement', 'event', 'promotion', 'update', 'other').optional(),
  image: Joi.string().uri().allow('', null).optional(),
  author: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isImportant: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  date: Joi.date().optional(),
}).min(1);
