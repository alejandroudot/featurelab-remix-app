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
  const checklist = (() => {
    try {
      const parsed = JSON.parse(String(row.checklist ?? '[]'));
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (item) =>
            item &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            typeof item.text === 'string' &&
            typeof item.done === 'boolean',
        )
        .map((item) => ({ id: item.id, text: item.text, done: item.done }));
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
    checklist,
    dueDate: row.dueDate ?? null,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    orderIndex: Number(row.orderIndex ?? 0),
    assigneeId: row.assigneeId ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
