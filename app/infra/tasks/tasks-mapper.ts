import type { Task } from '~/core/tasks/tasks.types';

export function mapTasksRow(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
