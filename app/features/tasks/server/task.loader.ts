import { asc } from 'drizzle-orm';
import type {
  TaskActivityQueryService,
  TaskCommentQueryService,
  TaskQueryService,
} from '~/core/tasks/tasks.port';
import { parseTasksViewStateFromUrl } from './task-view-state';
import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';

type RunTaskLoaderInput = {
  request: Request;
  userId: string;
  taskQueryService: TaskQueryService;
  taskActivityQueryService: TaskActivityQueryService;
  taskCommentQueryService: TaskCommentQueryService;
};

export async function runTaskLoader({
  request,
  userId,
  taskQueryService,
  taskActivityQueryService,
  taskCommentQueryService,
}: RunTaskLoaderInput) {
  const tasks = await taskQueryService.listByUser(userId);
  const taskActivities = await taskActivityQueryService.listByUser(userId);
  const taskComments = await taskCommentQueryService.listByUser(userId);
  // Por ahora trae todos los usuarios.
  const assignableUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .orderBy(asc(users.email))
    .all();

  const url = new URL(request.url);
  const viewState = parseTasksViewStateFromUrl(url);

  return {
    currentUserId: userId,
    tasks,
    taskActivities,
    taskComments,
    assignableUsers,
    viewState,
  };
}
