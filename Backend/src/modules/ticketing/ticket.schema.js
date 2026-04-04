import Joi from 'joi';
import { TicketCategory, TicketSubType, TicketStatus } from '../../shared/constants/enums.js';

/**
 * Ticket Joi Schemas
 */

export const createTicketSchema = Joi.object({
  category: Joi.string().valid(...Object.values(TicketCategory)).required(),
  sub_type: Joi.string().valid(...Object.values(TicketSubType)).required(),
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  price: Joi.number().min(0).required(),
  trip_limit: Joi.number().integer().min(1).optional().allow(null),
  discount_percent: Joi.number().min(0).max(100).default(0),
  restrictions: Joi.string().trim().optional().allow(null),
  availableFrom: Joi.date().iso().optional().allow(null),
  availableUntil: Joi.date().iso().optional().allow(null),
  status: Joi.string().valid(...Object.values(TicketStatus)).default(TicketStatus.INACTIVE),
}).options({ allowUnknown: false });

export const updateTicketSchema = Joi.object({
  category: Joi.string().valid(...Object.values(TicketCategory)).optional(),
  sub_type: Joi.string().valid(...Object.values(TicketSubType)).optional(),
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional(),
  trip_limit: Joi.number().integer().min(1).optional().allow(null),
  discount_percent: Joi.number().min(0).max(100).optional(),
  restrictions: Joi.string().trim().optional().allow(null),
  availableFrom: Joi.date().iso().optional().allow(null),
  availableUntil: Joi.date().iso().optional().allow(null),
  status: Joi.string().valid(...Object.values(TicketStatus)).optional(),
}).min(1);
