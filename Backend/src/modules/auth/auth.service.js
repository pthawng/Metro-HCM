import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UAParser } from 'ua-parser-js';
import * as authRepo from './auth.repo.js';
import AppError from '../../core/error/AppError.js';
import config from '../../core/config/config.js';

/**
 * Generate Access and Refresh Tokens
 * @param {Object} user 
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      userId: user._id, 
      phoneNumber: user.phoneNumber, 
      email: user.email, 
      role: user.role 
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    config.refreshSecret,
    { expiresIn: config.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

/**
 * Create a new user session
 */
const createSession = async (userId, refreshToken, userAgentString, ip) => {
  const ua = new UAParser(userAgentString).getResult();
  await authRepo.createSession({
    userId,
    refreshToken,
    userAgent: userAgentString,
    ip,
    os: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim(),
    browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim(),
    device: ua.device.model || 'Unknown',
    lastActiveAt: new Date(),
  });
};

/**
 * Login user by phone and password
 */
export const loginUser = async (phoneNumber, password, userAgentString, ip) => {
  const user = await authRepo.findUserByPhone(phoneNumber);
  if (!user) {
    throw new AppError('Số điện thoại chưa đăng ký hoặc mật khẩu không đúng!', 401);
  }

  if (!user.password) {
    throw new AppError('Tài khoản này được đăng ký qua Google. Vui lòng đăng nhập bằng Google.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Số điện thoại hoặc mật khẩu không đúng!', 401);
  }

  if (user.status !== 'active') {
    throw new AppError(`Tài khoản của bạn đang ở trạng thái: ${user.status}`, 403);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await authRepo.saveUser(user);
  await createSession(user._id, refreshToken, userAgentString, ip);

  return { user, accessToken, refreshToken };
};

/**
 * Login via Google
 */
export const loginWithGoogle = async (user, userAgentString, ip) => {
  if (!user) {
    throw new AppError('Không tìm thấy thông tin người dùng từ Google', 401);
  }

  if (user.status !== 'active') {
    throw new AppError(`Tài khoản của bạn đang bị ${user.status}`, 403);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await authRepo.saveUser(user);
  await createSession(user._id, refreshToken, userAgentString, ip);

  return { user, accessToken, refreshToken };
};

/**
 * Refresh Auth Token
 */
export const refreshAuthToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new AppError('Không có Refresh Token!', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, config.refreshSecret);
  } catch (err) {
    throw new AppError('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.', 403);
  }

  const user = await authRepo.findUserById(decoded.userId);
  if (!user || user.refreshToken !== oldRefreshToken) {
    throw new AppError('Refresh Token không hợp lệ hoặc đã được sử dụng!', 403);
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  user.refreshToken = newRefreshToken;
  await authRepo.saveUser(user);

  await authRepo.updateSessionByToken(oldRefreshToken, { 
    refreshToken: newRefreshToken, 
    lastActiveAt: new Date() 
  });

  return { newAccessToken: accessToken, newRefreshToken };
};

/**
 * Logout User
 */
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  
  await Promise.all([
    authRepo.updateUser({ refreshToken }, { $unset: { refreshToken: "" } }),
    authRepo.deleteSessionByToken(refreshToken)
  ]);
};

/**
 * Get User Sessions
 */
export const getUserSessions = async (userId, currentRefreshToken) => {
  const sessions = await authRepo.findSessionsByUserId(userId);
  
  return sessions.map((s) => ({
    id: s._id,
    ip: s.ip,
    device: s.device,
    os: s.os,
    browser: s.browser,
    userAgent: s.userAgent,
    lastActiveAt: s.lastActiveAt,
    createdAt: s.createdAt,
    isCurrentSession: s.refreshToken === currentRefreshToken,
  }));
};
