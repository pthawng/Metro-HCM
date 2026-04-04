import Joi from 'joi';

/**
 * Auth Joi Schemas
 */

export const loginSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Số điện thoại phải bao gồm 10-11 chữ số',
      'any.required': 'Số điện thoại là bắt buộc',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
}).options({ allowUnknown: false });
