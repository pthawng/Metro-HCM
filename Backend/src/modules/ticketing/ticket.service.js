import * as ticketRepo from './ticket.repo.js';
import AppError from '../../core/error/AppError.js';

/**
 * Ticket Service — Business Logic for Ticket module.
 */

export const getAllTickets = (filter) => 
  ticketRepo.findAll(filter);

export const getTicketById = async (id) => {
  const ticket = await ticketRepo.findById(id);
  if (!ticket) throw new AppError('Vé không tồn tại', 404);
  return ticket;
};

export const getTicketsByCriteria = (criteria) => 
  ticketRepo.findByCriteria(criteria);

export const getTicketTypes = () => 
  ticketRepo.getDistinct('category');

export const createTicket = (data) => 
  ticketRepo.create(data);

export const updateTicket = async (id, data) => {
  const updatedTicket = await ticketRepo.updateById(id, data);
  if (!updatedTicket) throw new AppError('Vé không tồn tại', 404);
  return updatedTicket;
};

export const deleteTicket = async (id) => {
  const deletedTicket = await ticketRepo.deleteById(id);
  if (!deletedTicket) throw new AppError('Vé không tồn tại', 404);
  return deletedTicket;
};
