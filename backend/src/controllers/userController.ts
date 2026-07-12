import { Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { AuthRequest } from '../types';

export const userController = {
  async getAllUsers(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  },

  async getAssignees(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAssignees();
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  },

  async updateRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUserRole(String(req.params.id), req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};
