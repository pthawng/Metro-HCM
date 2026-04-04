import Joi from 'joi';

/**
 * Train Joi Schemas
 */

export const createTrainSchema = Joi.object({
  trainNumber: Joi.string().required(),
  name: Joi.string().optional(),
  currentLine: Joi.string().required(), // MongoDB ObjectId
  lastStation: Joi.string().optional(),
  nextStation: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive', 'maintenance', 'moving', 'stopped').default('active'),
  statusMessage: Joi.string().optional(),
  capacity: Joi.number().integer().min(1).required(),
  currentLoad: Joi.number().integer().min(0).default(0),
}).options({ allowUnknown: false });

export const updateTrainSchema = Joi.object({
  trainNumber: Joi.string().optional(),
  name: Joi.string().optional(),
  currentLine: Joi.string().optional(),
  lastStation: Joi.string().optional(),
  nextStation: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'maintenance', 'moving', 'stopped').optional(),
  statusMessage: Joi.string().optional(),
  capacity: Joi.number().integer().min(1).optional(),
  currentLoad: Joi.number().integer().min(0).optional(),
}).min(1);
