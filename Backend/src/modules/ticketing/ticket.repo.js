import Ticket from '../../models/ticket.model.js';

/**
 * Ticket Repository
 * DB Access Layer for Ticket resource.
 */

export const findAll = (filter = {}) => 
  Ticket.find(filter).lean();

export const findById = (id) => 
  Ticket.findById(id).lean();

export const findByCriteria = (criteria) => 
  Ticket.find(criteria).lean();

export const getDistinct = (field) => 
  Ticket.distinct(field);

export const create = (data) => 
  Ticket.create(data);

export const updateById = (id, data) => 
  Ticket.findByIdAndUpdate(id, data, { 
    new: true, 
    runValidators: true 
  });

export const deleteById = (id) => 
  Ticket.findByIdAndDelete(id);
