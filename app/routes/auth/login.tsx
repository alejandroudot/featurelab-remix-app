import type { Route } from './+types/login';
import { redirect, useActionData } from 'react-router';

import { LoginPage } from '~/features/auth/LoginPage';
import type { AuthActionData } from '~/features/auth/types';
import { runLoginAction } from '~/features/auth/server/login.action';
import { getOptionalUser } from '~/infra/auth/require-user';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect('/');
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const url = new URL(request.url);

  return runLoginAction({
    formData,
    redirectTo: url.searchParams.get('redirectTo'),
  });
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>() as AuthActionData;
  return <LoginPage actionData={actionData} />;
}
