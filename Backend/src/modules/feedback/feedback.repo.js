import Feedback from '../../models/feedback.model.js';

/**
 * Feedback Repository
 * DB Access Layer for Feedback resource.
 */

export const findAll = (filter = {}) => 
  Feedback.find(filter).sort({ createdAt: -1 }).lean();

export const findById = (id) => 
  Feedback.findById(id).lean();

export const create = (data) => 
  Feedback.create(data);

export const updateById = (id, data) => 
  Feedback.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => 
  Feedback.findByIdAndDelete(id);

export const countByCriteria = (criteria) => 
  Feedback.countDocuments(criteria);

export const aggregateByRating = () => 
  Feedback.aggregate([
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);
