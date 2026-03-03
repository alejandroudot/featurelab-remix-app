import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/verify-email';
import { runVerifyEmailLoader, type VerifyEmailLoaderData } from '~/server/auth/verify-email.loader';

export async function loader({ request }: Route.LoaderArgs) {
  return runVerifyEmailLoader({ request });
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
