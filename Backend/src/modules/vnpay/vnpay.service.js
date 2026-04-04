import dayjs from 'dayjs';
import crypto from 'crypto';
import qs from 'qs';
import { createRequire } from 'module';
import * as paymentRepo from '../payment/payment.repo.js';
import * as paymentService from '../payment/payment.service.js';
import AppError from '../../core/error/AppError.js';
import logger from '../../core/logger/logger.js';

const require = createRequire(import.meta.url);
const vnpayConfig = require('../../config/vnpay.json');

/**
 * Helper: Sắp xếp và encode tham số cho VNPay
 */
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

/**
 * VNPay Service — Business Logic for VNPay integration.
 */

export const createPaymentUrl = async (orderId, amount, language, ipAddr) => {
  const date = new Date();
  const createDate = dayjs(date).format('YYYYMMDDHHmmss');

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: language || 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toán vé METRO :${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  sortedParams['vnp_SecureHash'] = signed;

  return vnpayConfig.vnp_Url + '?' + qs.stringify(sortedParams, { encode: false });
};

export const validateIpn = async (query) => {
  let vnp_Params = { ...query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  const orderId = vnp_Params['vnp_TxnRef'];
  const rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  if (secureHash !== signed) {
    return { RspCode: '97', Message: 'Checksum failed' };
  }

  const order = await paymentRepo.findByOrderId(orderId);
  if (!order) {
    return { RspCode: '01', Message: 'Order not found' };
  }

  const checkAmount = parseInt(order.totalPrice * 100) === parseInt(vnp_Params['vnp_Amount']);
  if (!checkAmount) {
    return { RspCode: '04', Message: 'Amount invalid' };
  }

  if (order.paymentStatus !== 'pending') {
    return { RspCode: '02', Message: 'This order has been updated to the payment status' };
  }

  if (rspCode === '00') {
    order.paymentStatus = 'paid';
  } else {
    order.paymentStatus = 'failed';
  }

  await paymentRepo.saveOrder(order);
  return { RspCode: '00', Message: 'Success' };
};

export const validateReturn = (query) => {
  const params = { ...query };
  const secureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  const isValid = secureHash === signed;
  const orderId = params['vnp_TxnRef'];
  const code = params['vnp_ResponseCode'];

  return { isValid, orderId, code };
};
