import express from 'express';
import * as stationController from './station.controller.js';
import { createStationSchema, updateStationSchema } from './station.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Station Routes
 */

router.get(
  '/', 
  stationController.getAllStations
);

router.get(
  '/nearby', 
  stationController.getNearbyStations
);

router.get(
  '/:id', 
  stationController.getStationById
);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createStationSchema),
  stationController.createStation
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateStationSchema),
  stationController.updateStation
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  stationController.deleteStation
);

export default router;
