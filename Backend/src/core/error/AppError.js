/**
 * AppError — Operational Error Class
 *
 * Phân biệt giữa:
 * - Operational errors (isOperational=true): lỗi người dùng gây ra, có thể xử lý được
 *   VD: "Mật khẩu sai", "Không tìm thấy tài nguyên"
 * - Programming errors (isOperational=false): bug trong code, không nên lộ chi tiết
 *   VD: DB connection fail, undefined is not a function
 */
class AppError extends Error {
  /**
   * @param {string} message - Thông báo lỗi cho client
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 500...)
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Giữ stack trace sạch — không bao gồm constructor này
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
