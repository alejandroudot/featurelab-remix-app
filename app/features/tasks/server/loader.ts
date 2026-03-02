import { asc } from 'drizzle-orm';
import { z } from 'zod';
import type {
  TaskActivityQueryPort,
  TaskCommentQueryPort,
  TaskQueryPort,
} from '~/core/tasks/task.repository.port';
import type { TasksFiltersState } from '../types';
import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';

type RunTaskLoaderInput = {
  request: Request;
  userId: string;
  taskQueryPort: TaskQueryPort;
  taskActivityQueryPort: TaskActivityQueryPort;
  taskCommentQueryPort: TaskCommentQueryPort;
};

const tasksFiltersSearchParamsSchema = z.object({
  view: z.enum(['list', 'board']).default('board'),
  order: z.enum(['manual', 'priority']).default('manual'),
  scope: z.enum(['all', 'assigned', 'created']).default('all'),
});

function parseTasksFiltersFromUrl(url: URL): TasksFiltersState {
  const parsed = tasksFiltersSearchParamsSchema.safeParse({
    view: url.searchParams.get('view') ?? undefined,
    order: url.searchParams.get('order') ?? undefined,
    scope: url.searchParams.get('scope') ?? undefined,
  });

  if (!parsed.success) {
    return {
      view: 'board',
      order: 'manual',
      scope: 'all',
    };
  }

  return parsed.data;
}

export async function runTaskLoader({ request, userId, taskQueryPort, taskActivityQueryPort, taskCommentQueryPort }: RunTaskLoaderInput) {
  const tasks = await taskQueryPort.listByUser(userId);
  const taskActivities = await taskActivityQueryPort.listByUser(userId);
  const taskComments = await taskCommentQueryPort.listByUser(userId);
  // Por ahora trae todos los usuarios.
  const assignableUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .orderBy(asc(users.email))
    .all();

  const url = new URL(request.url);
  const viewState = parseTasksFiltersFromUrl(url);

  return {
    currentUserId: userId,
    tasks,
    taskActivities,
    taskComments,
    assignableUsers,
    viewState,
  };
}

