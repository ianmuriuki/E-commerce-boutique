import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header or cookies
  let token: string | undefined;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('Access token is required', 401));
  }

  try {
    // Verify token
    const decoded: JWTPayload = verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (roles.includes('admin') && !req.user.isAdmin) {
      return next(new AppError('Admin access required', 403));
    }

    next();
  };
};

export const optionalAuth = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded: JWTPayload = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
    }
  }

  next();
});

// Export protect as the main authentication middleware
export { protect };
// Also export authenticate as an alias for backward compatibility
export const authenticate = protect;