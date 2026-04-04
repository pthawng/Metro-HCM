import * as userRepo from './user.repo.js';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import AppError from '../../core/error/AppError.js';
import User from '../../models/user.model.js';

/**
 * User Service — Business Logic for User module.
 */

export const register = async (data) => {
  const { phoneNumber, name, password } = data;
  const existingUser = await userRepo.findByPhone(phoneNumber);
  
  if (existingUser) {
    throw new AppError('Số điện thoại đã được sử dụng', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  return userRepo.create({
    phoneNumber,
    name,
    password: hashedPassword,
    role: 'user',
    signupType: 'phone',
  });
};

export const getAllUsers = async (role) => {
  const roleFilter = role ? { role } : {};
  return userRepo.findAll(roleFilter);
};

export const createUser = async (data) => {
  const { signupType, phoneNumber, name, password, role, email, address } = data;

  if (signupType === 'phone') {
    const existingUser = await userRepo.findByPhone(phoneNumber);
    if (existingUser) throw new AppError('Số điện thoại đã được sử dụng', 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepo.create({
      phoneNumber,
      name,
      password: hashedPassword,
      role,
      address,
      signupType
    });
  } else if (signupType === 'google') {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) throw new AppError('Email đã được sử dụng', 400);

    return userRepo.create({
      email,
      name,
      role,
      address,
      signupType
    });
  } else {
    throw new AppError('Hình thức đăng ký không hợp lệ', 400);
  }
};

export const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) throw new AppError('User không tồn tại', 404);
  return user;
};

export const updateUser = async (id, data, currentUserRole) => {
  const exists = await userRepo.exists(id);
  if (!exists) throw new AppError('User không tồn tại', 404);

  const { name, email, phoneNumber, role, address, status } = data;
  const updatePayload = { name, email, phoneNumber, address, status };

  // Only admin can change roles
  if (role && currentUserRole === 'admin') {
    updatePayload.role = role;
  }

  return userRepo.updateById(id, updatePayload);
};

export const deleteUser = async (id) => {
  const exists = await userRepo.exists(id);
  if (!exists) throw new AppError('User không tồn tại', 404);
  return userRepo.deleteById(id);
};

export const getNewUsersStats = async (range) => {
  let startDate;
  switch (range) {
    case 'day':
      startDate = dayjs().startOf('day');
      break;
    case 'week':
      startDate = dayjs().startOf('week');
      break;
    case 'month':
      startDate = dayjs().startOf('month');
      break;
    default:
      startDate = dayjs().startOf('year');
  }

  const count = await userRepo.countByCriteria({
    createdAt: { $gte: startDate.toDate() }
  });

  return { timeRange: range, count };
};

export const changePassword = async (id, oldPassword, newPassword) => {
  // We need password field here to compare
  const user = await User.findById(id); 
  if (!user) throw new AppError('User không tồn tại', 404);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new AppError('Mật khẩu cũ không đúng', 400);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return true;
};
