import { redirect } from 'react-router';
import { z } from 'zod';

import { loginSchema } from '~/core/auth/login.schema';
import type { AuthActionData } from '~/features/auth/types';
import { authService } from '~/infra/auth/auth.service';
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
    const { sessionId } = await authService.login(parsed.data);

    const headers = new Headers();
    setSessionCookie(headers, sessionId);

    return redirect(safeRedirect(input.redirectTo, '/tasks'), { headers });
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'Credenciales invalidas.',
        values: { email: parsed.data.email },
      } satisfies AuthActionData,
      { status: 401 },
    );
  }
}
