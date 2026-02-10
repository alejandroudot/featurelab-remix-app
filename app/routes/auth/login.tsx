import type { Route } from './+types/login';
import { Form, Link, redirect, useActionData } from 'react-router';
import { z } from 'zod';

import { authService } from '~/infra/auth/auth.service';
import { setSessionCookie } from '~/infra/auth/session-cookie';
import { getOptionalUser } from '~/infra/auth/require-user';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Requerido'),
});

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

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values: { email: String(formData.get('email') ?? '') },
      } satisfies ActionData,
      { status: 400 },
    );
  }

  try {
    const { sessionId } = await authService.login(parsed.data);

    const headers = new Headers();
    setSessionCookie(headers, sessionId);

    return redirect('/', { headers });
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'Credenciales inválidas.',
        values: { email: parsed.data.email },
      } satisfies ActionData,
      { status: 401 },
    );
  }
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>() as ActionData;

  const emailError = actionData?.fieldErrors?.email?.[0];
  const passwordError = actionData?.fieldErrors?.password?.[0];

  return (
    <main className="container mx-auto p-4 max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>

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
            autoComplete="current-password"
          />
          {passwordError ? <div className="text-xs text-red-600">{passwordError}</div> : null}
        </div>

        <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium">
          Entrar
        </button>
      </Form>

      <p className="text-sm opacity-80">
        ¿No tenés cuenta?{' '}
        <Link className="underline" to="/register">
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}
