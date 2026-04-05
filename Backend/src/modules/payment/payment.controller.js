import * as paymentService from './payment.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';
import { createOrderSchema, updateStatusSchema } from './payment.validation.js';

/**
 * Payment Controller — Thin layer.
 */

export const createPayment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  
  // Extract idempotency key from header for Big Tech standard
  const idempotencyKey = req.headers['x-idempotency-key'] || req.body.idempotencyKey;
  
  // Domain Validation
  const validatedData = createOrderSchema.parse({ ...req.body, idempotencyKey });

  const order = await paymentService.createPayment(userId, validatedData);
  sendCreated(res, order, 'Tạo đơn hàng thành công');
});

export const updatePaymentStatus = catchAsync(async (req, res) => {
  const validatedData = updateStatusSchema.parse(req.body);
  const order = await paymentService.updatePaymentStatus(validatedData.orderId, validatedData.paymentStatus);
  sendSuccess(res, order, { message: 'Cập nhật trạng thái thanh toán thành công!' });
});

export const getPaymentById = catchAsync(async (req, res) => {
  const order = await paymentService.getPaymentByOrderId(req.params.orderId);
  sendSuccess(res, order);
});

export const generateQRCode = catchAsync(async (req, res) => {
  const qrCode = await paymentService.generateQRCode(req.params.orderId);
  sendSuccess(res, { qrCode }, { message: 'Tạo mã QR thành công' });
});

export const getTicketHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const history = await paymentService.getTicketHistory(userId);
  sendSuccess(res, history);
});
