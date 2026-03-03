import type { Route } from './+types/register';
import { redirect } from 'react-router';

import { RegisterPage } from '~/features/auth/RegisterPage';
import { getOptionalUser } from '~/infra/auth/require-user';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect('/');
  return null;
}

export default function RegisterRoute() {
  return <RegisterPage />;
}
