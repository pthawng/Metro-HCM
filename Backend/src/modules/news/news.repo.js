import News from '../../models/news.model.js';

/**
 * News Repository
 */

export const findAll = (filter = {}) => 
  News.find(filter).sort({ date: -1 }).lean();

export const findById = (id) => 
  News.findById(id).lean();

export const create = (data) => 
  News.create(data);

export const updateById = (id, data) => 
  News.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => 
  News.findByIdAndDelete(id);

export const findLatest = (limit = 10) => 
  News.find().sort({ date: -1 }).limit(limit).lean();

export const findImportant = () => 
  News.find({ isImportant: true }).sort({ date: -1 }).lean();
