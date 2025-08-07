import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { AuthService } from '../services/authService';
import { config } from '../config/environment';
import { AuthRequest } from '../middlewares/auth';

const setCookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await AuthService.register(req.body);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    ...setCookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie('refreshToken', refreshToken, setCookieOptions);

  sendSuccess(res, 'User registered successfully', {
    user,
    accessToken,
  }, 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    ...setCookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie('refreshToken', refreshToken, setCookieOptions);

  sendSuccess(res, 'Login successful', {
    user,
    accessToken,
  });
});

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await AuthService.logout(req.user._id.toString());
  }

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  sendSuccess(res, 'Logout successful');
});

export const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  sendSuccess(res, 'Profile retrieved successfully', req.user);
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await AuthService.updateProfile(req.user!._id.toString(), req.body);
  sendSuccess(res, 'Profile updated successfully', user);
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  // Implementation for refresh token logic would go here
  // For now, we'll just return an error
  sendSuccess(res, 'Refresh token endpoint - to be implemented');
});