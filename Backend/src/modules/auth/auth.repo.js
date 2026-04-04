import User from '../../models/user.model.js';
import UserSession from '../../models/UserSession.js';

/**
 * Auth Repository
 */

export const findUserByPhone = (phoneNumber) => 
  User.findOne({ phoneNumber });

export const findUserById = (id) => 
  User.findById(id);

export const saveUser = (user) => 
  user.save();

export const updateUser = (filter, data) => 
  User.findOneAndUpdate(filter, data, { new: true });

export const createSession = (data) => 
  UserSession.create(data);

export const findSessionsByUserId = (userId) => 
  UserSession.find({ userId }).sort({ lastActiveAt: -1 });

export const updateSessionByToken = (refreshToken, data) => 
  UserSession.findOneAndUpdate({ refreshToken }, data, { new: true });

export const deleteSessionByToken = (refreshToken) => 
  UserSession.findOneAndDelete({ refreshToken });

export const deleteSessionsByUserId = (userId) => 
  UserSession.deleteMany({ userId });
