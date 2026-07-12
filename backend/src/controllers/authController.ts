import { Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../types';

export const authController = {
  async signup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
