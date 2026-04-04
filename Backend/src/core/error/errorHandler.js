import logger from '../logger/logger.js';
import AppError from './AppError.js';

/**
 * Global Error Handler Middleware
 * Phải là middleware CUỐI CÙNG trong Express chain (4 tham số).
 *
 * Logic:
 * - Dev: trả về full stack trace để debug
 * - Prod:
 *   - Operational error (AppError): trả message rõ ràng
 *   - Non-operational (bug): log chi tiết, trả generic message
 */

// Xử lý lỗi Mongoose CastError (VD: ObjectId không hợp lệ)
const handleCastErrorDB = (err) => {
  const message = `Giá trị '${err.value}' không hợp lệ cho trường ${err.path}`;
  return new AppError(message, 400);
};

// Xử lý lỗi trùng key trong MongoDB (unique constraint)
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const message = `Giá trị '${err.keyValue?.[field]}' đã tồn tại. Vui lòng dùng giá trị khác.`;
  return new AppError(message, 400);
};

// Xử lý lỗi Mongoose validation
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Dữ liệu không hợp lệ: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Xử lý JWT expired
const handleJWTExpiredError = () =>
  new AppError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);

// Xử lý JWT signature invalid
const handleJWTError = () =>
  new AppError('Token không hợp lệ. Vui lòng đăng nhập lại.', 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
    requestId: req.id,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational error — safe to expose to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      requestId: req.id,
    });
  }

  // Programming / unknown error — don't leak details
  logger.error('[UNHANDLED ERROR]', {
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Đã xảy ra lỗi hệ thống. Vui lòng liên hệ hỗ trợ kèm mã lỗi.',
    requestId: req.id,
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, req, res);
  }

  // Production: xử lý các loại lỗi thông thường
  // Gán message và name vào error object mới vì chúng không enumerable mặc định trong Error class
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;
  error.name = err.name;
  error.stack = err.stack;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  sendErrorProd(error, req, res);
};

export default errorHandler;
