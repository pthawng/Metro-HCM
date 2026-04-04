import Joi from 'joi';

/**
 * User Joi Schemas
 */

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).when('signupType', { is: 'phone', then: Joi.required() }),
  email: Joi.string().email().when('signupType', { is: 'google', then: Joi.required() }),
  password: Joi.string().min(6).when('signupType', { is: 'phone', then: Joi.required() }),
  role: Joi.string().valid('user', 'admin', 'staff').default('user'),
  address: Joi.string().optional(),
  signupType: Joi.string().valid('phone', 'google').required(),
}).options({ allowUnknown: false });

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).optional(),
  role: Joi.string().valid('user', 'admin', 'staff').optional(),
  address: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
}).options({ allowUnknown: false });

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
}).options({ allowUnknown: false });
