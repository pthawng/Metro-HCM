import Joi from 'joi';

/**
 * Transit Joi Schemas (Line)
 */

export const createLineSchema = Joi.object({
  name: Joi.string().trim().required(),
  code: Joi.string().trim().uppercase().required(),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{3}){1,2}$/).required(),
  description: Joi.string().trim().optional(),
  stations: Joi.array().items(Joi.string()).min(2).required(), // Array of Station ObjectIds
  status: Joi.string().valid('operational', 'construction', 'maintenance', 'planned').default('operational'),
}).options({ allowUnknown: false });

export const updateLineSchema = Joi.object({
  name: Joi.string().trim().optional(),
  code: Joi.string().trim().uppercase().optional(),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{3}){1,2}$/).optional(),
  description: Joi.string().trim().optional(),
  stations: Joi.array().items(Joi.string()).min(2).optional(),
  status: Joi.string().valid('operational', 'construction', 'maintenance', 'planned').optional(),
}).min(1);

export const searchRouteSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
}).options({ allowUnknown: false });
