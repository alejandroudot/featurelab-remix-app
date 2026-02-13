import { Form, Link } from 'react-router';
import type { AuthActionData } from './types';

export function RegisterPage({ actionData }: { actionData: AuthActionData }) {
  const emailError = actionData?.fieldErrors?.email?.[0];
  const passwordError = actionData?.fieldErrors?.password?.[0];

  return (
    <main className="container mx-auto p-4 max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>

      {actionData?.formError ? (
        <div className="border rounded p-3 text-sm bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200">
          {actionData.formError}
        </div>
      ) : null}

      <Form method="post" className="space-y-3">
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
          {emailError ? <div className="text-xs text-red-600">{emailError}</div> : null}
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
            autoComplete="new-password"
          />
          {passwordError ? <div className="text-xs text-red-600">{passwordError}</div> : null}
        </div>

        <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium">
          Registrarme
        </button>
      </Form>

      <p className="text-sm opacity-80">
        Ya tenes cuenta?{' '}
        <Link className="underline" to="/auth/login">
          Entrar
        </Link>
      </p>
    </main>
  );
}
