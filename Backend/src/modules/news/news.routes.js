import express from 'express';
import * as newsController from './news.controller.js';
import { createNewsSchema, updateNewsSchema } from './news.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * News Routes
 */

router.get(
  '/', 
  newsController.getAllNews
);

router.get(
  '/latest', 
  newsController.getLatestNews
);

router.get(
  '/important', 
  newsController.getImportantNews
);

router.get(
  '/:id', 
  newsController.getNewsById
);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createNewsSchema),
  newsController.createNews
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateNewsSchema),
  newsController.updateNews
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  newsController.deleteNews
);

export default router;
