// app/core/task/task.types.ts
export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'qa'
  | 'ready-to-go-live'
  | 'done'
  | 'discarded';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Task = {
  id: string;
  userId: string;
  projectId: string | null;
  title: string;
  description?: string | null;
  labels: string[];
  checklist: TaskChecklistItem[];
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
  | 'checklist-changed'
  | 'comment-added'
  | 'comment-updated'
  | 'comment-deleted'
  | 'due-date-changed'
  | 'status-changed'
  | 'priority-changed'
  | 'assignee-changed'
  | 'reordered'
  | 'deleted';

export type TaskComment = {
  id: string;
  taskId: string;
  authorUserId: string;
  authorEmail: string | null;
  body: string;
  createdAt: Date;
};

export type TaskActivity = {
  id: string;
  taskId: string;
  actorUserId: string;
  actorEmail: string | null;
  action: TaskActivityAction;
  metadata: Record<string, string | number | boolean | null> | null;
  createdAt: Date;
};



