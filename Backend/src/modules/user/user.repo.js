import User from '../../models/user.model.js';

/**
 * User Repository
 * DB Access Layer for User resource.
 */

export const findAll = (filter = {}) => 
  User.find(filter).select('-password -__v').lean();

export const findById = (id) => 
  User.findById(id).select('-password -__v').lean();

export const findByPhone = (phoneNumber) => 
  User.findOne({ phoneNumber }).lean();

export const findByEmail = (email) => 
  User.findOne({ email }).lean();

export const exists = (id) => 
  User.exists({ _id: id });

export const create = (data) => 
  User.create(data);

export const updateById = (id, data) => 
  User.findByIdAndUpdate(id, data, { 
    new: true, 
    runValidators: true 
  }).select('-password -__v');

export const deleteById = (id) => 
  User.findByIdAndDelete(id);

export const countByCriteria = (criteria) => 
  User.countDocuments(criteria);
