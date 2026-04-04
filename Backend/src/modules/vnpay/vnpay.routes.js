import express from 'express';
import * as vnpayController from './vnpay.controller.js';

const router = express.Router();

/**
 * VNPay Routes
 */

router.post(
  '/',
  vnpayController.createPayment
);

router.get(
  '/vnpay_return',
  vnpayController.vnpayReturn
);

router.get(
  '/vnpay_ipn',
  vnpayController.vnpayIpn
);

export default router;
