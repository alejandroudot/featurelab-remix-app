import { useActionData, useLoaderData, useNavigation } from 'react-router';
import { TasksPage } from '~/features/tasks/TasksPage';
import type { Route } from './+types/tasks';
import { taskCommandService, taskQueryService } from '../infra/tasks/task.repository';
import { flagQueryService } from '../infra/flags/flags.repository';
import type { TaskActionData } from '~/features/tasks/types';
import { requireUser } from '~/infra/auth/require-user';
import { runTaskAction } from '~/features/tasks/server/task.action';
import { runTaskLoader } from '~/features/tasks/server/task.loader';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runTaskLoader({ request, userId: user.id, taskQueryService, flagQueryService });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  // La route solo orquesta; la logica de intents vive en un helper dedicado.
  return runTaskAction({
    formData,
    userId: user.id,
    taskCommandService,
  });
}

export default function TasksRoute() {
  const { tasks, assignableUsers, viewState, betaTasksUI } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<TaskActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <TasksPage
      tasks={tasks}
      assignableUsers={assignableUsers}
      viewState={viewState}
      actionData={actionData}
      isSubmitting={isSubmitting}
      betaTasksUI={betaTasksUI}
    />
  );
}

