import jwt from 'jsonwebtoken';
import config from '../core/config/config.js';
import AppError from '../core/error/AppError.js';

/**
 * authenticateToken
 * Middleware JWT chuẩn — verify token và attach req.user
 * Tất cả lỗi đi qua next() → global error handler (không return JSON trực tiếp)
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return next(new AppError('Không tìm thấy token xác thực. Vui lòng đăng nhập.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: decoded.userId,
      phoneNumber: decoded.phoneNumber,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401));
    }
    return next(new AppError('Token không hợp lệ. Vui lòng đăng nhập lại.', 401));
  }
};

/**
 * authorizeRoles
 * Middleware kiểm tra role — chỉ cho phép các role được chỉ định
 *
 * Usage:
 *   router.delete('/:id', authenticateToken, authorizeRoles('admin'), controller.delete);
 */
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(
      new AppError(
        `Bạn không có quyền thực hiện hành động này. Yêu cầu role: ${allowedRoles.join(', ')}`,
        403
      )
    );
  }
  next();
};
