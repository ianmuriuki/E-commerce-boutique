import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  pagination?: ApiResponse['pagination']
): Response => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(pagination && { pagination })
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  pagination?: ApiResponse['pagination']
): Response => {
  return sendResponse(res, statusCode, true, message, data, pagination);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error })
  };

  return res.status(statusCode).json(response);
};