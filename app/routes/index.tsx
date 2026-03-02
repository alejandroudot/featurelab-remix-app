import { useActionData, useLoaderData, useNavigation } from 'react-router';
import { ProjectWorkspacePage } from '~/features/project/ProjectWorkspacePage';
import type { Route } from './+types/index';
import { taskPort } from '~/infra/task/task.repository.provider';
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
    taskPort,
  });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  return runTaskAction({
    formData,
    userId: user.id,
    taskPort,
    notificationService,
  });
}

export default function IndexRoute() {
  const { currentUserId, tasks, taskActivities, taskComments, assignableUsers, viewState } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<TaskActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <ProjectWorkspacePage
      currentUserId={currentUserId}
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



