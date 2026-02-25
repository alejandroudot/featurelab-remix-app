import type { Task } from '~/core/tasks/tasks.types';

export function mapTasksRow(row: any): Task {
  const labels = (() => {
    try {
      const parsed = JSON.parse(String(row.labels ?? '[]'));
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => typeof item === 'string') as string[];
    } catch {
      return [];
    }
  })();

  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description ?? undefined,
    labels,
    dueDate: row.dueDate ?? null,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    orderIndex: Number(row.orderIndex ?? 0),
    assigneeId: row.assigneeId ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
