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
  labels: string[];
  dueDate?: Date | null;
  status: TaskStatus;
  priority: TaskPriority;
  orderIndex: number;
  assigneeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskActivityAction =
  | 'created'
  | 'updated'
  | 'labels-changed'
  | 'due-date-changed'
  | 'status-changed'
  | 'priority-changed'
  | 'assignee-changed'
  | 'reordered'
  | 'deleted';

export type TaskActivity = {
  id: string;
  taskId: string;
  actorUserId: string;
  actorEmail: string | null;
  action: TaskActivityAction;
  metadata: Record<string, string | number | boolean | null> | null;
  createdAt: Date;
};
