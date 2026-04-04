import express from 'express';
import * as feedbackController from './feedback.controller.js';
import { createFeedbackSchema, updateFeedbackSchema } from './feedback.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Feedback Routes
 */

// Public feedback creation
router.post(
  '/',
  validate(createFeedbackSchema),
  feedbackController.createFeedback
);

// Protected routes (Admin/Staff only)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'staff'),
  feedbackController.getAllFeedbacks
);

router.get(
  '/stats',
  authenticateToken,
  authorizeRoles('admin'),
  feedbackController.getStats
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'staff'),
  feedbackController.getFeedbackById
);

router.patch(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'staff'),
  validate(updateFeedbackSchema),
  feedbackController.updateFeedback
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  feedbackController.deleteFeedback
);

export default router;
