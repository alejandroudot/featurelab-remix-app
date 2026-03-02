import { useLoaderData } from 'react-router';
import type { Route } from './+types/home';

import { HomePage } from '~/features/home/HomePage';
import { runHomeAction } from '~/features/home/server/action';
import { runHomeLoader } from '~/features/home/server/loader';
import { requireUser } from '~/infra/auth/require-user';
import { flagDecisionService } from '~/infra/flags/flag.decision.provider';
import { flagRepository } from '~/infra/flags/flag.repository.provider';
import { taskQueryPort } from '~/infra/tasks/task.repository.provider';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runHomeLoader({ user, taskQueryPort, flagRepository, flagDecisionService });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runHomeAction({ formData, userRole: user.role, flagRepository });
}

export default function HomeRoute() {
  const data = useLoaderData<typeof loader>();
  return <HomePage {...data} />;
}

