import type { Task } from '~/core/tasks/tasks.types';

const CLOSED_STATUS = new Set<Task['status']>(['done', 'discarded']);

export function isTaskOverdue(task: Pick<Task, 'status' | 'dueDate'>, now = new Date()): boolean {
  if (!task.dueDate) return false;
  if (CLOSED_STATUS.has(task.status)) return false;
  return task.dueDate.getTime() < now.getTime();
}

export function formatDateUTC(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear());
  return `${day}/${month}/${year}`;
}
