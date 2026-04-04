import express from 'express';
import * as authController from './auth.controller.js';
import { loginSchema } from './auth.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import createRateLimiter from '../../middlewares/rateLimit.middleware.js';

const router = express.Router();
const loginLimiter = createRateLimiter(15, 5, 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.');

/**
 * Auth Routes
 * POST /auth/login
 * POST /auth/refresh-token
 * POST /auth/logout
 * GET /auth/google
 * GET /auth/google/callback
 * GET /auth/sessions (protected)
 * GET /auth/me (protected)
 */

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  authController.refreshToken
);

router.post(
  '/logout',
  authController.logout
);

// Google OAuth
router.get(
  '/google',
  authController.googleAuth
);

router.get(
  '/google/callback',
  authController.googleCallback
);

// Protected Auth Routes
router.get(
  '/sessions',
  authenticateToken,
  authController.getSessions
);

router.get(
  '/me',
  authenticateToken,
  authController.getMe
);

export default router;
