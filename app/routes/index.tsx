import { useLoaderData } from 'react-router';
import { ProjectWorkspace } from '~/features/project/ProjectWorkspace';
import type { Route } from './+types/index';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { projectRepository } from '~/infra/project/project.repository.provider';
import { requireUser } from '~/infra/auth/require-user';
import { runTaskLoader } from '~/server/task/loader';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runTaskLoader({
    request,
    userId: user.id,
    taskRepository,
    projectRepository,
  });
}

export default function IndexRoute() {
  const { currentUserId, projects, tasks, taskActivities, taskComments, assignableUsers, viewState } =
    useLoaderData<typeof loader>();

  return (
    <ProjectWorkspace
      currentUserId={currentUserId}
      projects={projects}
      tasks={tasks}
      taskActivities={taskActivities}
      taskComments={taskComments}
      assignableUsers={assignableUsers}
      viewState={viewState}
    />
  );
}
