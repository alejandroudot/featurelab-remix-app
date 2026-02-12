import type { Route } from './+types/register';
import { Form, Link, redirect, useActionData } from 'react-router';
import { z } from 'zod';

import { authService } from '~/infra/auth/auth.service';
import { setSessionCookie } from '~/infra/auth/session-cookie';
import { registerSchema } from '~/core/auth/register.schema';
import { getOptionalUser } from '~/infra/auth/require-user';
import { safeRedirect } from '~/infra/http/redirects';

type ActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[]>;
      values?: { email: string };
    }
  | undefined;

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect('/');
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
	const url = new URL(request.url);
	const redirectTo = url.searchParams.get("redirectTo");

  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error).fieldErrors;
    return Response.json(
      {
        success: false,
        fieldErrors: flattened,
        values: { email: String(formData.get('email') ?? '') },
      } satisfies ActionData,
      { status: 400 },
    );
  }

  try {
    // 1) create user
    await authService.register(parsed.data);

    // 2) auto-login (create session + cookie)
    const { sessionId } = await authService.login(parsed.data);

    const headers = new Headers();
    setSessionCookie(headers, sessionId);

		return redirect(safeRedirect(redirectTo, "/"), { headers });
  } catch (err) {
    // Error codes simples del manual auth
    const code = err instanceof Error ? err.message : 'UNKNOWN';
    const formError =
      code === 'EMAIL_TAKEN'
        ? 'Ese email ya está registrado.'
        : 'No se pudo registrar. Probá de nuevo.';

    return Response.json(
      { success: false, formError, values: { email: parsed.data.email } } satisfies ActionData,
      {
        status: 400,
      },
    );
  }
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>() as ActionData;

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
        ¿Ya tenés cuenta?{' '}
        <Link className="underline" to="/auth/login">
          Entrar
        </Link>
      </p>
    </main>
  );
}
