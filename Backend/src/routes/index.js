import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import transitRoutes from '../modules/transit/transit.routes.js';
import ticketRoutes from '../modules/ticketing/ticket.routes.js';
import stationRoutes from '../modules/station/station.routes.js';
import paymentRoutes from '../modules/payment/payment.routes.js';
import vnpayRoutes from '../modules/vnpay/vnpay.routes.js';
import feedbackRoutes from '../modules/feedback/feedback.routes.js';
import newsRoutes from '../modules/news/news.routes.js';
import trainRoutes from '../modules/train/train.routes.js';
import progressRoutes from '../modules/progress/progress.routes.js';

const router = express.Router();

/**
 * Registry of all modular routes.
 * All paths follow the same convention.
 */

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/lines', transitRoutes); 
router.use('/tickets', ticketRoutes);
router.use('/stations', stationRoutes);
router.use('/order', paymentRoutes);
router.use('/vnpay', vnpayRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/news', newsRoutes);
router.use('/trains', trainRoutes);
router.use('/progress', progressRoutes);

export default router;
