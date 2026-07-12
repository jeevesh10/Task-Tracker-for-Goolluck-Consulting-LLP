import prisma from '../config/database';

export const commentRepository = {
  findByTaskId(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  create(data: { taskId: string; message: string; createdById: string }) {
    return prisma.comment.create({
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
