import { redirect } from 'react-router';
import { z } from 'zod';

import { registerSchema } from '~/core/auth/register.schema';
import type { AuthActionData } from '~/features/auth/types';
import { authService } from '~/infra/auth/auth.service';
import { setSessionCookie } from '~/infra/auth/session-cookie';
import { safeRedirect } from '~/infra/http/redirects';

type RunRegisterActionInput = {
  formData: FormData;
  redirectTo: string | null;
};

// Ejecuta register + autologin para que la route solo orqueste.
export async function runRegisterAction(input: RunRegisterActionInput) {
  const parsed = registerSchema.safeParse({
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
    await authService.register(parsed.data);
    const { sessionId } = await authService.login(parsed.data);

    const headers = new Headers();
    setSessionCookie(headers, sessionId);

    return redirect(safeRedirect(input.redirectTo, '/'), { headers });
  } catch (err) {
    const code = err instanceof Error ? err.message : 'UNKNOWN';
    const formError =
      code === 'EMAIL_TAKEN'
        ? 'Ese email ya esta registrado.'
        : 'No se pudo registrar. Proba de nuevo.';

    return Response.json(
      {
        success: false,
        formError,
        values: { email: parsed.data.email },
      } satisfies AuthActionData,
      { status: 400 },
    );
  }
}
