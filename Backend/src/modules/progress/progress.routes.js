import express from 'express';
import * as progressController from './progress.controller.js';
import { createProgressSchema, updateProgressSchema } from './progress.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Progress Routes
 */

router.get(
  '/', 
  progressController.getAllProgress
);

router.get(
  '/line/:lineId', 
  progressController.getProgressByLine
);

router.get(
  '/overall/:lineId', 
  progressController.getOverall
);

router.get(
  '/:id', 
  progressController.getProgressById
);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createProgressSchema),
  progressController.createProgress
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateProgressSchema),
  progressController.updateProgress
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  progressController.deleteProgress
);

export default router;
