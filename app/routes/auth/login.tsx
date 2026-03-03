import type { Route } from './+types/login';
import { redirect, useSearchParams } from 'react-router';

import { LoginPage } from '~/features/auth/LoginPage';
import { getOptionalUser } from '~/infra/auth/require-user';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect('/');
  return null;
}

export default function LoginRoute() {
  const [searchParams] = useSearchParams();
  const emailVerificationStatus = searchParams.get('emailVerification');
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const infoMessage =
    emailVerificationStatus === 'sent'
      ? 'Te enviamos un link de verificacion por email. Revisa tu casilla.'
      : emailVerificationStatus === 'verified'
        ? 'Email verificado. Ya podes iniciar sesion.'
        : undefined;

  return <LoginPage infoMessage={infoMessage} redirectTo={redirectTo} />;
}
