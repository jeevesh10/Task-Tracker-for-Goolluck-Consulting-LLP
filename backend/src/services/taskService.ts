import { Role } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dto';
import { taskRepository } from '../repositories/taskRepository';
import { userRepository } from '../repositories/userRepository';
import { AppError, JwtPayload } from '../types';

export const taskService = {
  async getTasks(query: TaskQueryDto, user: JwtPayload) {
    return taskRepository.findAll({
      ...query,
      userId: user.userId,
      role: user.role,
    });
  },

  async getTaskById(taskId: string, user: JwtPayload) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    this.assertCanView(task, user);
    return task;
  },

  async createTask(dto: CreateTaskDto, user: JwtPayload) {
    if (dto.assignedToId) {
      const assignee = await userRepository.findById(dto.assignedToId);
      if (!assignee) {
        throw new AppError(400, 'Assigned user not found');
      }
    }

    return taskRepository.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: dto.status,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      createdById: user.userId,
      assignedToId: dto.assignedToId,
    });
  },

  async updateTask(taskId: string, dto: UpdateTaskDto, user: JwtPayload) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    if (user.role === Role.MEMBER) {
      if (task.assignedToId !== user.userId) {
        throw new AppError(403, 'You can only update tasks assigned to you');
      }
      if (Object.keys(dto).some((k) => k !== 'status')) {
        const hasNonStatusFields = dto.title !== undefined ||
          dto.description !== undefined ||
          dto.priority !== undefined ||
          dto.dueDate !== undefined ||
          dto.assignedToId !== undefined;
        if (hasNonStatusFields) {
          throw new AppError(403, 'Members can only update task status');
        }
      }
      if (dto.status === undefined) {
        throw new AppError(400, 'Members must provide a status update');
      }
      return taskRepository.update(taskId, { status: dto.status });
    }

    if (dto.assignedToId) {
      const assignee = await userRepository.findById(dto.assignedToId);
      if (!assignee) {
        throw new AppError(400, 'Assigned user not found');
      }
    }

    return taskRepository.update(taskId, {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: dto.status,
      dueDate: dto.dueDate !== undefined
        ? (dto.dueDate ? new Date(dto.dueDate) : null)
        : undefined,
      assignedToId: dto.assignedToId,
    });
  },

  async deleteTask(taskId: string, user: JwtPayload) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    if (user.role === Role.MEMBER) {
      throw new AppError(403, 'Members cannot delete tasks');
    }
    await taskRepository.delete(taskId);
  },

  assertCanView(
    task: { assignedToId: string | null; createdById: string },
    user: JwtPayload
  ) {
    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
      return;
    }
    if (task.assignedToId !== user.userId) {
      throw new AppError(403, 'You do not have access to this task');
    }
  },
};
