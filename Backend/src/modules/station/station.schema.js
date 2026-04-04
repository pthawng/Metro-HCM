import Joi from 'joi';

/**
 * Station Joi Schemas
 */

export const createStationSchema = Joi.object({
  name: Joi.string().trim().required(),
  code: Joi.string().trim().uppercase().required(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(), // [longitude, latitude]
  }).required(),
  address: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  facilities: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().default(true),
}).options({ allowUnknown: false });

export const updateStationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  code: Joi.string().trim().uppercase().optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
  }).optional(),
  address: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  facilities: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
