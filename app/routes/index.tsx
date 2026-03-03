import { useActionData, useLoaderData, useNavigation } from 'react-router';
import { ProjectWorkspace } from '~/features/project/ProjectWorkspace';
import type { Route } from './+types/index';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { projectRepository } from '~/infra/project/project.repository.provider';
import { notificationService } from '~/infra/notifications/notifications.service';
import type { TaskActionData } from '~/features/task/types';
import { requireUser } from '~/infra/auth/require-user';
import { runTaskAction } from '~/features/task/server/action';
import { runTaskLoader } from '~/features/task/server/loader';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runTaskLoader({
    request,
    userId: user.id,
    taskRepository,
    projectRepository,
  });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '').trim();

  if (intent === 'project-create') {
    const name = String(formData.get('name') ?? '').trim();
    const imageUrlRaw = String(formData.get('imageUrl') ?? '').trim();
    if (name.length > 0) {
      await projectRepository.create({
        userId: user.id,
        name,
        imageUrl: imageUrlRaw.length > 0 ? imageUrlRaw : null,
      });
    }
    return null;
  }

  if (intent === 'project-delete') {
    const id = String(formData.get('id') ?? '').trim();
    if (id.length > 0) {
      await projectRepository.remove({
        id,
        userId: user.id,
      });
    }
    return null;
  }

  return runTaskAction({
    formData,
    userId: user.id,
    taskRepository,
    notificationService,
  });
}

export default function IndexRoute() {
  const { currentUserId, projects, tasks, taskActivities, taskComments, assignableUsers, viewState } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<TaskActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <ProjectWorkspace
      currentUserId={currentUserId}
      projects={projects}
      tasks={tasks}
      taskActivities={taskActivities}
      taskComments={taskComments}
      assignableUsers={assignableUsers}
      viewState={viewState}
      actionData={actionData}
      isSubmitting={isSubmitting}
    />
  );
}
