import express from 'express';
import * as paymentController from './payment.controller.js';
import { createPaymentSchema, updateStatusSchema } from './payment.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import createRateLimiter from '../../middlewares/rateLimit.middleware.js';

const router = express.Router();
const paymentLimiter = createRateLimiter(15, 10, 'Bạn đã gửi quá nhiều yêu cầu thanh toán. Vui lòng thử lại sau 15 phút.');

/**
 * Payment Routes
 */

router.post(
  '/',
  authenticateToken,
  paymentLimiter,
  validate(createPaymentSchema),
  paymentController.createPayment
);

router.post(
  '/update-status',
  authenticateToken,
  paymentLimiter,
  validate(updateStatusSchema),
  paymentController.updatePaymentStatus
);

router.get(
  '/history',
  authenticateToken,
  paymentController.getTicketHistory
);

router.get(
  '/:orderId',
  authenticateToken,
  paymentController.getPaymentById
);

router.post(
  '/:orderId/qr',
  authenticateToken,
  paymentController.generateQRCode
);

export default router;
