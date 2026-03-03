import { useLoaderData } from 'react-router';
import type { Route } from './+types/account';
import { AccountPage } from '~/features/account/AccountPage';
import { runAccountLoader } from '~/server/account/loader';
import { requireUser } from '~/infra/auth/require-user';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runAccountLoader({ user });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();
  return <AccountPage user={user} />;
}
