import Progress from '../../models/progress.model.js';

/**
 * Progress Repository
 */

export const findAll = (filter = {}) => 
  Progress.find(filter).sort({ date: -1 }).lean();

export const findById = (id) => 
  Progress.findById(id).lean();

export const findByLine = (lineId) => 
  Progress.find({ lineId }).sort({ date: -1 }).lean();

export const create = (data) => 
  Progress.create(data);

export const updateById = (id, data) => 
  Progress.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => 
  Progress.findByIdAndDelete(id);

export const getOverallProgress = (lineId) => 
  Progress.findOne({ lineId }).sort({ date: -1 }).lean();
