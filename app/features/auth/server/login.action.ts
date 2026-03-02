import { redirect } from 'react-router';
import { z } from 'zod';

import { loginSchema } from '~/core/auth/login.schema';
import type { AuthActionData } from '~/features/auth/types';
import { authRepository } from '~/infra/auth/auth.repository.provider';
import { setSessionCookie } from '~/infra/auth/session-cookie';
import { safeRedirect } from '~/infra/http/redirects';

type RunLoginActionInput = {
  formData: FormData;
  redirectTo: string | null;
};

// Ejecuta login de forma aislada para mantener la route liviana.
export async function runLoginAction(input: RunLoginActionInput) {
  const parsed = loginSchema.safeParse({
    email: input.formData.get('email'),
    password: input.formData.get('password'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values: { email: String(input.formData.get('email') ?? '') },
      } satisfies AuthActionData,
      { status: 400 },
    );
  }

  try {
    const { sessionId } = await authRepository.login(parsed.data);

    const headers = new Headers();
    setSessionCookie(headers, sessionId);

    return redirect(safeRedirect(input.redirectTo, '/tasks'), { headers });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    const formError =
      code === 'EMAIL_NOT_VERIFIED'
        ? 'Tu email todavia no esta verificado. Revisa el link que te enviamos.'
        : 'Credenciales invalidas.';

    return Response.json(
      {
        success: false,
        formError,
        values: { email: parsed.data.email },
      } satisfies AuthActionData,
      { status: 401 },
    );
  }
}
