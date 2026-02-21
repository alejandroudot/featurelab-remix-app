// app/core/tasks/task.port.ts
import type { Task } from './tasks.types';
import type { z } from 'zod';
import type { taskCreateSchema } from './task.schema';

// 1) lo que viene del cliente (formData)
export type TaskCreateDTO = z.infer<typeof taskCreateSchema>;

// 2) lo que necesita el dominio/infra para crear (server command)
export type TaskCreateInput = TaskCreateDTO & { userId: string };

export type TaskUpdateInput = {
  id: string;
  userId: string;
  status?: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string | null;
};

export interface TaskService {
  listAll(): Promise<Task[]>; // más adelante será listByUser(userId)
  listByUser(userId: string): Promise<Task[]>;
  create(input: TaskCreateInput): Promise<Task>;
  update(input: TaskUpdateInput): Promise<Task>;
  remove(input: { id: string; userId: string }): Promise<void>;
}
