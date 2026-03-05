import { asc } from 'drizzle-orm';
import type { ProjectRepository } from '~/core/project/project.repository.port';
import type { TaskRepository } from '~/core/task/task.repository.port';
import type { ProjectViewState } from '~/features/task/types';
import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';
import { getUserPreferencesFromRequest } from '~/infra/preferences/preferences-cookie';
import { z } from 'zod';

type RunTaskLoaderInput = {
  request: Request;
  userId: string;
  taskRepository: TaskRepository;
  projectRepository: ProjectRepository;
};

const viewQueryParamSchema = z.enum(['list', 'board']);
const orderQueryParamSchema = z.enum(['manual', 'priority']);
const scopeQueryParamSchema = z.enum(['all', 'assigned', 'created']);

function parseTasksFiltersFromUrl(url: URL): Partial<ProjectViewState> {
  const parsedView = viewQueryParamSchema.safeParse(url.searchParams.get('view'));
  const parsedOrder = orderQueryParamSchema.safeParse(url.searchParams.get('order'));
  const parsedScope = scopeQueryParamSchema.safeParse(url.searchParams.get('scope'));

  return {
    view: parsedView.success ? parsedView.data : undefined,
    order: parsedOrder.success ? parsedOrder.data : undefined,
    scope: parsedScope.success ? parsedScope.data : undefined,
  };
}

export async function runTaskLoader({ request, userId, taskRepository, projectRepository }: RunTaskLoaderInput) {
  const projects = await projectRepository.listByUser(userId);
  const tasks = await taskRepository.listByUser(userId);
  const taskActivities = await taskRepository.listActivitiesByUser(userId);
  const taskComments = await taskRepository.listCommentsByUser(userId);
  // Por ahora trae todos los usuarios.
  const assignableUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .orderBy(asc(users.email))
    .all();

  const url = new URL(request.url);
  const urlFilters = parseTasksFiltersFromUrl(url);
  const preferences = getUserPreferencesFromRequest(request);

  const viewState: ProjectViewState = {
    view: urlFilters.view ?? preferences.defaultTasksView,
    order: urlFilters.order ?? preferences.defaultTasksOrder,
    scope: urlFilters.scope ?? preferences.defaultTasksScope,
  };
  const activeProjectId = url.searchParams.get('project');

  return {
    currentUserId: userId,
    projects,
    tasks,
    taskActivities,
    taskComments,
    assignableUsers,
    viewState,
    activeProjectId,
  };
}



