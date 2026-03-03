import { Link, useFetcher } from 'react-router';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
import type { AuthActionData } from './types';

export function LoginPage({
  infoMessage,
  redirectTo,
}: {
  infoMessage?: string;
  redirectTo?: string;
}) {
  const fetcher = useFetcher<AuthActionData>();
  const actionData = fetcher.data;

  return (
    <main className="container mx-auto p-4 max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>

      {infoMessage ? (
        <p className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          {infoMessage}
        </p>
      ) : null}

      <ActionFeedbackText
        actionData={actionData}
        showFormError
        errorClassName="border rounded p-3 text-sm bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200"
      />

      <fetcher.Form method="post" action="/api/auth/login" className="space-y-3">
        {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            defaultValue={actionData?.values?.email ?? ''}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="email" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="password" />
        </div>

        <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium">Entrar</button>
      </fetcher.Form>

      <p className="text-sm opacity-80">
        No tenes cuenta?{' '}
        <Link className="underline" to="/auth/register">
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}
