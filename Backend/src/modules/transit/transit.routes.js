import express from 'express';
import * as transitController from './transit.controller.js';
import { createLineSchema, updateLineSchema, searchRouteSchema } from './transit.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Transit Routes
 */

// Search route (Public)
router.get(
  '/search', 
  validate(searchRouteSchema, 'query'),
  transitController.searchRoutes
);

router.get(
  '/', 
  transitController.getAllLines
);

router.get(
  '/:id', 
  transitController.getLineById
);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createLineSchema),
  transitController.createLine
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateLineSchema),
  transitController.updateLine
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  transitController.deleteLine
);

export default router;
