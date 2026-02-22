// app/core/tasks/task.port.ts
import type { z } from 'zod';
import type { taskCreateSchema } from './task.schema';
import type { Task } from './tasks.types';

// 1) Lo que viene del cliente (formData).
export type TaskCreateDTO = z.infer<typeof taskCreateSchema>;

// 2) Lo que necesita el dominio/infra para crear (server command).
export type TaskCreateInput = TaskCreateDTO & { userId: string };

export type TaskUpdateInput = {
  id: string;
  userId: string;
  status?: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string | null;
};

export interface TaskQueryService {
  listAll(): Promise<Task[]>;
  listByUser(userId: string): Promise<Task[]>;
}

export interface TaskCommandService {
  create(input: TaskCreateInput): Promise<Task>;
  update(input: TaskUpdateInput): Promise<Task>;
  remove(input: { id: string; userId: string }): Promise<void>;
}

// Alias de transicion para mantener compatibilidad mientras migramos imports.
export type TaskService = TaskQueryService & TaskCommandService;
