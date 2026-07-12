import { NextFunction, Request, Response } from 'express';
import { AppError, ApiErrorResponse } from '../types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      message: err.message,
    };
    if (err.errors) {
      response.errors = err.errors;
    }
    return res.status(err.statusCode).json(response);
  }

  console.error('Unhandled error:', err);
  const response: ApiErrorResponse = {
    success: false,
    message: 'Internal server error',
  };
  return res.status(500).json(response);
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}
