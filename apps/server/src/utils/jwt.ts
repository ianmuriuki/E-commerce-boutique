import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { IUser } from '../models/User';

export interface JWTPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const generateAccessToken = (user: IUser): string => {
  const payload: JWTPayload = {
    id: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as string | number
  });
};

export const generateRefreshToken = (user: IUser): string => {
  const payload: JWTPayload = {
    id: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as string | number
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
};