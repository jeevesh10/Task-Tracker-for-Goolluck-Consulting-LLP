import { commentRepository } from '../repositories/commentRepository';
import { taskRepository } from '../repositories/taskRepository';
import { CreateCommentDto } from '../dto';
import { AppError, JwtPayload } from '../types';
import { taskService } from './taskService';

export const commentService = {
  async getComments(taskId: string, user: JwtPayload) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    taskService.assertCanView(task, user);
    return commentRepository.findByTaskId(taskId);
  },

  async addComment(taskId: string, dto: CreateCommentDto, user: JwtPayload) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    taskService.assertCanView(task, user);

    return commentRepository.create({
      taskId,
      message: dto.message,
      createdById: user.userId,
    });
  },
};
