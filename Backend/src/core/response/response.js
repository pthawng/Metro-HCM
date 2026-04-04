/**
 * Standardized API Response Wrapper
 *
 * Mọi response từ backend đều theo format nhất quán:
 * {
 *   "success": true,
 *   "data": <T>,
 *   "message": "...",
 *   "pagination": null | { page, limit, total, totalPages }
 * }
 *
 * Lý do:
 * - Frontend có thể destructure chắc chắn mà không cần if-else
 * - API contract rõ ràng
 * - Dễ extend (thêm traceId, timestamp về sau)
 */

export const sendSuccess = (res, data, { status = 200, message = 'Success', pagination = null } = {}) => {
  const body = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    body.pagination = pagination;
  }

  return res.status(status).json(body);
};

export const sendCreated = (res, data, message = 'Tạo thành công') =>
  sendSuccess(res, data, { status: 201, message });

export const sendNoContent = (res) => res.status(204).send();
