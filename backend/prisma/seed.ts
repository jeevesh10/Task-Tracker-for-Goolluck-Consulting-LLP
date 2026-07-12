import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@example.com',
      passwordHash,
      role: Role.MANAGER,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      name: 'Member User',
      email: 'member@example.com',
      passwordHash,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'member2@example.com' },
    update: {},
    create: {
      name: 'Jane Member',
      email: 'member2@example.com',
      passwordHash,
      role: Role.MEMBER,
    },
  });

  const existingTasks = await prisma.task.count();
  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Setup development environment',
          description: 'Install Node.js, PostgreSQL, and configure the project',
          priority: 'HIGH',
          status: 'DONE',
          dueDate: new Date('2026-07-01'),
          createdById: manager.id,
          assignedToId: member.id,
        },
        {
          title: 'Implement authentication',
          description: 'Add JWT-based login and signup with role-based access',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          dueDate: new Date('2026-07-15'),
          createdById: manager.id,
          assignedToId: member.id,
        },
        {
          title: 'Design dashboard UI',
          description: 'Create task list, filters, and detail views',
          priority: 'MEDIUM',
          status: 'TODO',
          dueDate: new Date('2026-07-20'),
          createdById: admin.id,
          assignedToId: member2.id,
        },
        {
          title: 'Write API documentation',
          description: 'Document all REST endpoints with examples',
          priority: 'LOW',
          status: 'TODO',
          dueDate: new Date('2026-07-25'),
          createdById: manager.id,
          assignedToId: member2.id,
        },
      ],
    });

    const task = await prisma.task.findFirst({ where: { title: 'Implement authentication' } });
    if (task) {
      await prisma.comment.create({
        data: {
          taskId: task.id,
          message: 'JWT middleware is working. Need to add refresh token support later.',
          createdById: member.id,
        },
      });
    }
  }

  console.log('Seed completed successfully!');
  console.log('\nSample credentials (password for all: password123):');
  console.log('  Admin:   admin@example.com');
  console.log('  Manager: manager@example.com');
  console.log('  Member:  member@example.com');
  console.log('  Member2: member2@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
