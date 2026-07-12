export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: string | null;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: Pick<User, 'id' | 'name' | 'email'>;
  assignedTo: Pick<User, 'id' | 'name' | 'email'> | null;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  message: string;
  createdById: string;
  createdAt: string;
  createdBy: Pick<User, 'id' | 'name' | 'email'>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  assignedToId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
