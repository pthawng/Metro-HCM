import * as ticketService from './ticket.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * Ticket Controller
 */

export const getAllTickets = catchAsync(async (req, res) => {
  const tickets = await ticketService.getAllTickets(req.query);
  sendSuccess(res, tickets);
});

export const getTicketById = catchAsync(async (req, res) => {
  const ticket = await ticketService.getTicketById(req.params.id);
  sendSuccess(res, ticket);
});

export const createTicket = catchAsync(async (req, res) => {
  const ticket = await ticketService.createTicket(req.body);
  sendCreated(res, ticket, 'Tạo vé thành công');
});

export const updateTicket = catchAsync(async (req, res) => {
  const ticket = await ticketService.updateTicket(req.params.id, req.body);
  sendSuccess(res, ticket, { message: 'Cập nhật vé thành công' });
});

export const deleteTicket = catchAsync(async (req, res) => {
  await ticketService.deleteTicket(req.params.id);
  sendSuccess(res, null, { message: 'Xóa vé thành công' });
});

export const getTicketTypes = catchAsync(async (req, res) => {
  const types = await ticketService.getTicketTypes();
  sendSuccess(res, types);
});
