import { Response, NextFunction } from 'express';
import { TaskQueryDto } from '../dto';
import { taskService } from '../services/taskService';
import { AuthRequest } from '../types';

export const taskController = {
  async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = (req as AuthRequest & { validatedQuery: TaskQueryDto }).validatedQuery;
      const result = await taskService.getTasks(query, req.user!);
      res.json({
        success: true,
        data: result.tasks,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTaskById(String(req.params.id), req.user!);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.createTask(req.body, req.user!);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.updateTask(String(req.params.id), req.body, req.user!);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await taskService.deleteTask(String(req.params.id), req.user!);
      res.json({ success: true, data: { message: 'Task deleted successfully' } });
    } catch (err) {
      next(err);
    }
  },
};
