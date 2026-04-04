/**
 * catchAsync — async wrapper cho Express route handlers
 *
 * Thay vì viết try-catch trong mỗi async handler,
 * wrap nó trong catchAsync để lỗi tự động đi tới global error handler.
 *
 * Usage:
 *   router.get('/', catchAsync(async (req, res, next) => { ... }));
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
