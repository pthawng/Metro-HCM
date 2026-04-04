import Joi from 'joi';
import { TicketCategory, PaymentMethod, PaymentStatus } from '../../shared/constants/enums.js';

/**
 * Payment Joi Schemas
 */

export const createPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  userName: Joi.string().required(),
  userPhone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  ticketType: Joi.string().valid(...Object.values(TicketCategory)).required(),
  paymentMethod: Joi.string().valid(...Object.values(PaymentMethod)).required(),
  totalPrice: Joi.number().min(0).required(),
  paymentStatus: Joi.string().valid(...Object.values(PaymentStatus)).default(PaymentStatus.PENDING),
  routes: Joi.array().items(Joi.string()).optional(),
  groupSize: Joi.number().integer().min(1).when('ticketType', { is: 'nhom', then: Joi.required(), otherwise: Joi.optional() }),
}).options({ allowUnknown: true }); // Allow unknown for things like userId which might be added later

export const updateStatusSchema = Joi.object({
  orderId: Joi.string().required(),
  paymentStatus: Joi.string().valid(...Object.values(PaymentStatus)).required(),
}).options({ allowUnknown: false });
