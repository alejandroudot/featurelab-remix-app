// app/core/tasks/task.types.ts
export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'qa'
  | 'ready-to-go-live'
  | 'done'
  | 'discarded';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  orderIndex: number;
  assigneeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
