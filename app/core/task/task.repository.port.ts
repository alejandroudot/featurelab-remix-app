// app/core/task/task.repository.port.ts
import type { z } from 'zod';
import type { taskCreateSchema } from './task.schema';
import type {
  Task,
  TaskActivity,
  TaskActivityAction,
  TaskChecklistItem,
  TaskComment,
} from './task.types';

// 1) Lo que viene del cliente (formData).
export type TaskCreateDTO = z.infer<typeof taskCreateSchema>;

// 2) Lo que necesita el dominio/infra para crear (server command).
export type TaskCreateInput = TaskCreateDTO & { userId: string };

export type TaskUpdateInput = {
  id: string;
  userId: string;
  title?: string;
  description?: string | null;
  labels?: string[];
  checklist?: TaskChecklistItem[];
  dueDate?: Date | null;
  status?: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live' | 'done' | 'discarded';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  orderIndex?: number;
  assigneeId?: string | null;
};

export interface TaskRepository {
  listAll(): Promise<Task[]>;
  listByUser(userId: string): Promise<Task[]>;
  getByIdForUser(input: { id: string; userId: string }): Promise<Task | null>;
  create(input: TaskCreateInput): Promise<Task>;
  update(input: TaskUpdateInput): Promise<Task>;
  reorderColumn(input: {
    userId: string;
    status: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
    orderedTaskIds: string[];
  }): Promise<void>;
  remove(input: { id: string; userId: string }): Promise<void>;
  listActivitiesByUser(userId: string): Promise<TaskActivity[]>;
  createActivity(input: {
    taskId: string;
    actorUserId: string;
    action: TaskActivityAction;
    metadata?: Record<string, string | number | boolean | null>;
  }): Promise<void>;
  listCommentsByUser(userId: string): Promise<TaskComment[]>;
  getCommentByIdForUser(input: { id: string; userId: string }): Promise<TaskComment | null>;
  createComment(input: {
    taskId: string;
    authorUserId: string;
    body: string;
  }): Promise<TaskComment>;
  updateComment(input: {
    id: string;
    authorUserId: string;
    body: string;
  }): Promise<TaskComment>;
  removeComment(input: {
    id: string;
    authorUserId: string;
  }): Promise<void>;
}
