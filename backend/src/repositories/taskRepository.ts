import { Priority, Role, TaskStatus } from '@prisma/client';
import prisma from '../config/database';

const taskInclude = {
  createdBy: { select: { id: true, name: true, email: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
};

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  assignedToId?: string;
  search?: string;
  page: number;
  limit: number;
  userId: string;
  role: Role;
}

export const taskRepository = {
  async findAll(filters: TaskFilters) {
    const { status, priority, assignedToId, search, page, limit, userId, role } = filters;
    const where: Record<string, unknown> = {};

    if (role === Role.MEMBER) {
      where.assignedToId = userId;
    } else if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        ...taskInclude,
        comments: {
          include: {
            createdBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  create(data: {
    title: string;
    description?: string | null;
    priority?: Priority;
    status?: TaskStatus;
    dueDate?: Date | null;
    createdById: string;
    assignedToId?: string | null;
  }) {
    return prisma.task.create({
      data,
      include: taskInclude,
    });
  },

  update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      priority?: Priority;
      status?: TaskStatus;
      dueDate?: Date | null;
      assignedToId?: string | null;
    }
  ) {
    return prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },
};
