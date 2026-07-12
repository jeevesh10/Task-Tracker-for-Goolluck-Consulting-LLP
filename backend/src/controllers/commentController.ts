import { Response, NextFunction } from 'express';
import { commentService } from '../services/commentService';
import { AuthRequest } from '../types';

export const commentController = {
  async getComments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comments = await commentService.getComments(String(req.params.id), req.user!);
      res.json({ success: true, data: comments });
    } catch (err) {
      next(err);
    }
  },

  async addComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.addComment(String(req.params.id), req.body, req.user!);
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  },
};
