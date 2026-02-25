// app/core/tasks/task.port.ts
import type { z } from 'zod';
import type { taskCreateSchema } from './task.schema';
import type { Task, TaskActivity, TaskActivityAction } from './tasks.types';

// 1) Lo que viene del cliente (formData).
export type TaskCreateDTO = z.infer<typeof taskCreateSchema>;

// 2) Lo que necesita el dominio/infra para crear (server command).
export type TaskCreateInput = TaskCreateDTO & { userId: string };

export type TaskUpdateInput = {
  id: string;
  userId: string;
  labels?: string[];
  dueDate?: Date | null;
  status?: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live' | 'done' | 'discarded';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  orderIndex?: number;
  assigneeId?: string | null;
};

export interface TaskQueryService {
  listAll(): Promise<Task[]>;
  listByUser(userId: string): Promise<Task[]>;
  getByIdForUser(input: { id: string; userId: string }): Promise<Task | null>;
}

export interface TaskActivityQueryService {
  listByUser(userId: string): Promise<TaskActivity[]>;
}

export interface TaskCommandService {
  create(input: TaskCreateInput): Promise<Task>;
  update(input: TaskUpdateInput): Promise<Task>;
  reorderColumn(input: {
    userId: string;
    status: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
    orderedTaskIds: string[];
  }): Promise<void>;
  remove(input: { id: string; userId: string }): Promise<void>;
}

export interface TaskActivityCommandService {
  create(input: {
    taskId: string;
    actorUserId: string;
    action: TaskActivityAction;
    metadata?: Record<string, string | number | boolean | null>;
  }): Promise<void>;
}

// Alias de transicion para mantener compatibilidad mientras migramos imports.
export type TaskService = TaskQueryService & TaskCommandService;
