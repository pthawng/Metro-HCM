import express from 'express';
import * as ticketController from './ticket.controller.js';
import { createTicketSchema, updateTicketSchema } from './ticket.schema.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Ticket Routes
 */

router.get(
  '/', 
  ticketController.getAllTickets
);

router.get(
  '/types', 
  ticketController.getTicketTypes
);

router.get(
  '/:id', 
  ticketController.getTicketById
);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validate(createTicketSchema),
  ticketController.createTicket
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateTicketSchema),
  ticketController.updateTicket
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  ticketController.deleteTicket
);

export default router;
