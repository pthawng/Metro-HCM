import express from 'express';
import * as trainController from './train.controller.js';
import { createTrainSchema, updateTrainSchema } from './train.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Train Routes
 */

router.get(
  '/', 
  trainController.getAllTrains
);

router.get(
  '/:id', 
  trainController.getTrainById
);

router.get(
  '/line/:lineId', 
  trainController.getTrainsByLine
);

// Simulation (Development/Admin)
router.post(
  '/simulate/:lineId',
  authenticateToken,
  authorizeRoles('admin'),
  trainController.simulatePositions
);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createTrainSchema),
  trainController.createTrain
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateTrainSchema),
  trainController.updateTrain
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  trainController.deleteTrain
);

export default router;
