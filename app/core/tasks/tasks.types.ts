// app/core/tasks/task.types.ts
export type TaskStatus = 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
};
