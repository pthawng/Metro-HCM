import passport from 'passport';
import * as authService from './auth.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess } from '../../core/response/response.js';
import config from '../../core/config/config.js';

/**
 * Auth Controller — Thin layer.
 * Mỗi handler nhận req → gọi service → trả về response đồng nhất.
 */

const setTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.isProduction, 
    sameSite: config.isProduction ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
  });
};

export const login = catchAsync(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const { user, accessToken, refreshToken } = await authService.loginUser(
    phoneNumber, 
    password, 
    userAgent, 
    ip
  );

  setTokenCookie(res, refreshToken);

  sendSuccess(res, {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role
    }
  }, { message: 'Đăng nhập thành công' });
});

export const refreshToken = catchAsync(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  
  const { newAccessToken, newRefreshToken } = await authService.refreshAuthToken(oldRefreshToken);

  setTokenCookie(res, newRefreshToken);

  sendSuccess(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }, { message: 'Refresh token thành công' });
});

export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logoutUser(refreshToken);
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'None' : 'Lax'
  });

  sendSuccess(res, null, { message: 'Đăng xuất thành công' });
});

// Google Auth Handlers
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
  accessType: 'offline'
});

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(`${config.clientUrl}/login?error=google_auth_failed`);
    }

    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const { accessToken, refreshToken } = await authService.loginWithGoogle(user, userAgent, ip);

      setTokenCookie(res, refreshToken);

      // Redirect về frontend với token và thông tin user
      res.redirect(
        `${config.clientUrl}/auth-callback?token=${accessToken}&name=${encodeURIComponent(user.name)}&role=${user.role}&id=${user._id}`
      );
    } catch (error) {
      return res.redirect(`${config.clientUrl}/login?error=server_error`);
    }
  })(req, res, next);
};

export const getSessions = catchAsync(async (req, res) => {
  const currentRefreshToken = req.cookies.refreshToken;
  const sessions = await authService.getUserSessions(req.user.id, currentRefreshToken);
  
  sendSuccess(res, sessions, { message: 'Lấy danh sách phiên đăng nhập thành công' });
});

export const getMe = (req, res) => {
  sendSuccess(res, { user: req.user });
};
