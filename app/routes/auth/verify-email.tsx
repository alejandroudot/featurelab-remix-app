import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/verify-email';

import { authRepository } from '~/infra/auth/auth.repository.provider';

type VerifyEmailLoaderData = {
  status: 'success' | 'invalid' | 'expired' | 'missing' | 'error';
  message: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return Response.json({
      status: 'missing',
      message: 'Falta el token de verificacion.',
    } satisfies VerifyEmailLoaderData);
  }

  try {
    await authRepository.verifyEmailToken({ token });
    return Response.json({
      status: 'success',
      message: 'Tu email fue verificado correctamente.',
    } satisfies VerifyEmailLoaderData);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    if (code === 'EMAIL_TOKEN_EXPIRED') {
      return Response.json({
        status: 'expired',
        message: 'El link de verificacion expiro. Pedi uno nuevo.',
      } satisfies VerifyEmailLoaderData);
    }
    if (code === 'EMAIL_TOKEN_INVALID') {
      return Response.json({
        status: 'invalid',
        message: 'El link de verificacion no es valido o ya fue usado.',
      } satisfies VerifyEmailLoaderData);
    }
    return Response.json({
      status: 'error',
      message: 'No se pudo verificar el email. Intenta nuevamente.',
    } satisfies VerifyEmailLoaderData);
  }
}

export default function VerifyEmailRoute() {
  const data = useLoaderData<typeof loader>() as VerifyEmailLoaderData;

  const isSuccess = data.status === 'success';
  const boxClassName = isSuccess
    ? 'rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700'
    : 'rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700';

  return (
    <main className="container mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Verificacion de email</h1>
      <p className={boxClassName}>{data.message}</p>
      <Link
        to={isSuccess ? '/auth/login?emailVerification=verified' : '/auth/login'}
        className="inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Ir a login
      </Link>
    </main>
  );
}

