import { useActionData, useLoaderData, useNavigation } from 'react-router';
import { TasksPage } from '~/features/tasks/TasksPage';
import type { Route } from './+types/tasks';
import { taskService } from '../infra/tasks/task.repository';
import type { TaskActionData } from '~/features/tasks/types';
import { requireUser } from '~/infra/auth/require-user';
import { flagService } from '~/infra/flags/flags.repository';
import { getFlagDebugOverrideFromUrl } from '~/infra/flags/flag-debug';
import { runTaskAction } from '~/features/tasks/server/task.action';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const tasks = await taskService.listByUser(user.id);
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const url = new URL(request.url);

  const betaTasksUIResolution = await flagService.resolve({
    userId: user.id,
    key: 'beta-tasks-ui',
    environment,
    debugOverride: getFlagDebugOverrideFromUrl({
      url,
      key: 'beta-tasks-ui',
      enabled: isDevelopment,
    }),
  });

  return { tasks, betaTasksUI: betaTasksUIResolution.enabled, betaTasksUIResolution, isDevelopment };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  // La route solo orquesta; la logica de intents vive en un helper dedicado.
  return runTaskAction({
    formData,
    userId: user.id,
    taskService,
  });
}

export default function TasksRoute() {
  const { tasks, betaTasksUI, betaTasksUIResolution, isDevelopment } = useLoaderData<typeof loader>();
  const actionData = useActionData<TaskActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <TasksPage
      tasks={tasks}
      actionData={actionData}
      isSubmitting={isSubmitting}
      betaTasksUI={betaTasksUI}
      betaTasksUIResolution={isDevelopment ? betaTasksUIResolution : undefined}
    />
  );
}

