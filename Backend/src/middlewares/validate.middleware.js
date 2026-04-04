import AppError from '../core/error/AppError.js';

/**
 * Validate Middleware Factory
 *
 * Usage trong route:
 *   router.post('/login', validate(loginSchema), authController.login);
 *
 * Validates req.body by default.
 * Có thể extend để validate req.query, req.params bằng cách pass target.
 *
 * @param {Joi.Schema} schema - Joi schema
 * @param {'body' | 'query' | 'params'} target - Phần của request cần validate
 */
const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,      // Hiện tất cả lỗi, không dừng ở lỗi đầu tiên
    stripUnknown: true,     // Loại bỏ các field không có trong schema
    allowUnknown: false,    // Không cho phép field lạ
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join('; ');
    return next(new AppError(`Validation Error: ${messages}`, 400));
  }

  // Ghi đè req[target] bằng giá trị đã được validate và sanitize
  req[target] = value;
  next();
};

export default validate;
