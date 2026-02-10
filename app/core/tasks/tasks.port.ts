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
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
};

export interface TaskRepository {
  listAll(): Promise<Task[]>; // más adelante será listByUser(userId)
  listByUser(userId: string): Promise<Task[]>;
  create(input: TaskCreateInput): Promise<Task>;
  update(input: TaskUpdateInput): Promise<Task>;
  remove(id: string): Promise<void>;
}
