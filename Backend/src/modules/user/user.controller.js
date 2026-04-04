import * as userService from './user.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess } from '../../core/response/response.js';

/**
 * User Controller
 */

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req.query.role);
  sendSuccess(res, users);
});

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendSuccess(res, user, { status: 201, message: 'Tạo user thành công' });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, user);
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user.role);
  sendSuccess(res, user, { message: 'Cập nhật user thành công' });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, null, { message: 'Xóa user thành công' });
});

export const getStats = catchAsync(async (req, res) => {
  const stats = await userService.getNewUsersStats(req.query.range || 'month');
  sendSuccess(res, stats);
});

export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await userService.changePassword(req.user.id, oldPassword, newPassword);
  sendSuccess(res, null, { message: 'Đổi mật khẩu thành công' });
});
