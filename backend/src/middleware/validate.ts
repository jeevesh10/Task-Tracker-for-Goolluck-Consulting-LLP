import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../types';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.') || 'body';
        if (!errors[field]) errors[field] = [];
        errors[field].push(err.message);
      });
      return next(new AppError(400, 'Validation failed', errors));
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.') || 'query';
        if (!errors[field]) errors[field] = [];
        errors[field].push(err.message);
      });
      return next(new AppError(400, 'Validation failed', errors));
    }
    (req as Request & { validatedQuery: T }).validatedQuery = result.data;
    next();
  };
}
