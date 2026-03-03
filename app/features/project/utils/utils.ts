import type { Task } from '~/core/task/task.types';

const PRIORITY_RANK: Record<Task['priority'], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function getVisibleTasks({
  tasks,
  currentUserId,
  scope,
  order,
}: {
  tasks: Task[];
  currentUserId: string;
  scope: 'all' | 'assigned' | 'created';
  order: 'manual' | 'priority';
}) {
  const scopedTasks =
    scope === 'assigned'
      ? tasks.filter((task) => task.assigneeId === currentUserId)
      : scope === 'created'
        ? tasks.filter((task) => task.userId === currentUserId)
        : tasks;

  if (order === 'priority') {
    return [...scopedTasks].sort(
      (a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || a.orderIndex - b.orderIndex,
    );
  }

  return [...scopedTasks].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function buildAssigneeById(assignableUsers: Array<{ id: string; email: string }>) {
  return Object.fromEntries(assignableUsers.map((user) => [user.id, user.email])) as Record<string, string>;
}

export function filterTasksBySearch(tasks: Task[], searchTerm: string) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return tasks;

  return tasks.filter((task) =>
    `${task.title} ${(task.description ?? '').replace(/<[^>]*>/g, ' ')}`.toLowerCase().includes(query),
  );
}



