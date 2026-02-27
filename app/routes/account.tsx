import { useLoaderData } from 'react-router';
import type { Route } from './+types/account';
import { AccountPage } from '~/features/account/AccountPage';
import { requireUser } from '~/infra/auth/require-user';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return { user };
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();
  return <AccountPage user={user} />;
}
