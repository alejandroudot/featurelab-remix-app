import type { Route } from './+types/register';
import { redirect, useActionData } from 'react-router';

import { RegisterPage } from '~/features/auth/RegisterPage';
import type { AuthActionData } from '~/features/auth/types';
import { runRegisterAction } from '~/features/auth/server/register.action';
import { getOptionalUser } from '~/infra/auth/require-user';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect('/');
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const url = new URL(request.url);

  return runRegisterAction({
    formData,
    redirectTo: url.searchParams.get('redirectTo'),
  });
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>() as AuthActionData;
  return <RegisterPage actionData={actionData} />;
}
