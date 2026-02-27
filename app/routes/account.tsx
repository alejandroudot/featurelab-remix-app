import { useLoaderData } from 'react-router';
import type { Route } from './+types/account';
import { AccountPage } from '~/features/account/AccountPage';
import { runAccountAction } from '~/features/account/server/action';
import { runAccountLoader } from '~/features/account/server/loader';
import { requireUser } from '~/infra/auth/require-user';
import { authService } from '~/infra/auth/auth.service';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runAccountLoader({ user });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runAccountAction({ formData, userId: user.id, authService });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();
  return <AccountPage user={user} />;
}
