import * as vnpayService from './vnpay.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess } from '../../core/response/response.js';
import config from '../../core/config/config.js';

/**
 * VNPay Controller — Thin layer.
 */

export const createPayment = catchAsync(async (req, res) => {
  const { orderId, amount, language } = req.body;
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const paymentUrl = await vnpayService.createPaymentUrl(orderId, amount, language, ipAddr);

  sendSuccess(res, { paymentUrl }, { message: 'Tạo URL thanh toán VNPay thành công' });
});

export const vnpayReturn = catchAsync(async (req, res) => {
  const { isValid, orderId, code } = vnpayService.validateReturn(req.query);
  
  const baseRedirectUrl = config.clientUrl;

  if (isValid) {
    const redirectUrl = code === '00'
      ? `${baseRedirectUrl}/payment/success?code=${code}&orderId=${orderId}`
      : `${baseRedirectUrl}/payment/fail?code=${code}&orderId=${orderId}`;
    
    return res.redirect(redirectUrl);
  } else {
    return res.redirect(`${baseRedirectUrl}/payment/fail?code=97`);
  }
});

export const vnpayIpn = catchAsync(async (req, res) => {
  const result = await vnpayService.validateIpn(req.query);
  res.status(200).json(result);
});
