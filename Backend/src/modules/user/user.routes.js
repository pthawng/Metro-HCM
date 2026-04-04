import express from 'express';
import * as userController from './user.controller.js';
import { createUserSchema, updateUserSchema, changePasswordSchema } from './user.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * User Routes
 */

// Đổi mật khẩu (User tự đổi)
router.post(
  '/change-password',
  authenticateToken,
  validate(changePasswordSchema),
  userController.changePassword
);

// Admin routes
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getAllUsers
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createUserSchema),
  userController.createUser
);

router.get(
  '/stats',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getStats
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'staff'),
  userController.getUserById
);

router.patch(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  userController.deleteUser
);

export default router;
