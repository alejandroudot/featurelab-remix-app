import { asc } from 'drizzle-orm';
import type { FlagQueryService } from '~/core/flags/service/flags.service';
import type { TaskQueryService } from '~/core/tasks/tasks.port';
import { parseTasksViewStateFromUrl } from './task-view-state';
import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';

type RunTaskLoaderInput = {
  request: Request;
  userId: string;
  taskQueryService: TaskQueryService;
  flagQueryService: FlagQueryService;
};

export async function runTaskLoader({
  request,
  userId,
  taskQueryService,
}: RunTaskLoaderInput) {
  const tasks = await taskQueryService.listByUser(userId);
	// por ahora trae todos los usuarios
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
    assignableUsers,
    viewState
  };
}
