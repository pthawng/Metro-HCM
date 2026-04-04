import Train from '../../models/train.model.js';

/**
 * Train Repository
 */

export const findAll = (filter = {}) => 
  Train.find(filter).populate('currentLine').lean();

export const findById = (id) => 
  Train.findById(id).populate('currentLine').lean();

export const findOneByCriteria = (criteria) => 
  Train.findOne(criteria).populate('currentLine').lean();

export const create = (data) => 
  Train.create(data);

export const updateById = (id, data) => 
  Train.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('currentLine');

export const deleteById = (id) => 
  Train.findByIdAndDelete(id);

export const findTrainsByLine = (lineId) => 
  Train.find({ currentLine: lineId }).lean();
