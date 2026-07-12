import { Router } from 'express';
import { Role } from '@prisma/client';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { taskController } from '../controllers/taskController';
import { commentController } from '../controllers/commentController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  signupSchema,
  loginSchema,
  updateRoleSchema,
  createTaskSchema,
  updateTaskSchema,
  createCommentSchema,
  taskQuerySchema,
} from '../dto';

const router = Router();

// Auth routes (public)
router.post('/auth/signup', validateBody(signupSchema), authController.signup);
router.post('/auth/login', validateBody(loginSchema), authController.login);

// User routes
router.get(
  '/users/assignees',
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  userController.getAssignees
);
router.get('/users', authenticate, authorize(Role.ADMIN), userController.getAllUsers);
router.put(
  '/users/:id/role',
  authenticate,
  authorize(Role.ADMIN),
  validateBody(updateRoleSchema),
  userController.updateRole
);

// Task routes
router.post(
  '/tasks',
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  validateBody(createTaskSchema),
  taskController.createTask
);
router.get(
  '/tasks',
  authenticate,
  authorize(Role.MEMBER, Role.MANAGER, Role.ADMIN),
  validateQuery(taskQuerySchema),
  taskController.getTasks
);
router.get(
  '/tasks/:id',
  authenticate,
  authorize(Role.MEMBER, Role.MANAGER, Role.ADMIN),
  taskController.getTaskById
);
router.put(
  '/tasks/:id',
  authenticate,
  authorize(Role.MEMBER, Role.MANAGER, Role.ADMIN),
  validateBody(updateTaskSchema),
  taskController.updateTask
);
router.delete(
  '/tasks/:id',
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  taskController.deleteTask
);

// Comment routes
router.get(
  '/tasks/:id/comments',
  authenticate,
  authorize(Role.MEMBER, Role.MANAGER, Role.ADMIN),
  commentController.getComments
);
router.post(
  '/tasks/:id/comments',
  authenticate,
  authorize(Role.MEMBER, Role.MANAGER, Role.ADMIN),
  validateBody(createCommentSchema),
  commentController.addComment
);

export default router;
