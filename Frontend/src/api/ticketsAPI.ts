import api from './axiosInstance';
import { TicketSchema, Ticket } from '../types/schema';
import { z } from 'zod';

/**
 * Tickets API Module
 * Built with Zod for runtime verification.
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price);
};

export const getTickets = async (): Promise<Ticket[]> => {
  const data = await api.get('/tickets');
  return z.array(TicketSchema).parse(data);
};

export const getTicketById = async (id: string): Promise<Ticket> => {
  const data = await api.get(`/tickets/${id}`);
  return TicketSchema.parse(data);
};

export const createTicket = async (ticketData: Partial<Ticket>): Promise<Ticket> => {
  const data = await api.post('/tickets', ticketData);
  return TicketSchema.parse(data);
};

export const updateTicket = async (id: string, updatedData: Partial<Ticket>): Promise<Ticket> => {
  const data = await api.put(`/tickets/${id}`, updatedData);
  return TicketSchema.parse(data);
};

export const deleteTicket = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/tickets/${id}`);
};

export const getTicketTypes = async (): Promise<string[]> => {
  return await api.get('/tickets/types');
};