import { useLoaderData } from 'react-router';
import type { Route } from './+types/home';

import { HomePage } from '~/features/home/HomePage';
import { runHomeAction } from '~/features/home/server/home.action';
import { runHomeLoader } from '~/features/home/server/home.loader';
import { requireUser } from '~/infra/auth/require-user';
import { flagService } from '~/infra/flags/flags.repository';
import { taskService } from '~/infra/tasks/task.repository';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runHomeLoader({ user, taskService, flagService });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runHomeAction({ formData, userRole: user.role, flagService });
}

export default function HomeRoute() {
  const data = useLoaderData<typeof loader>();
  return <HomePage {...data} />;
}
