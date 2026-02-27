import { redirect } from 'react-router';
import { z } from 'zod';

import { normalizeComparableEmail } from '~/core/auth/credential-utils';
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
    displayName: input.formData.get('displayName'),
    email: input.formData.get('email'),
    confirmEmail: input.formData.get('confirmEmail'),
    password: input.formData.get('password'),
    confirmPassword: input.formData.get('confirmPassword'),
    phone: input.formData.get('phone'),
    timezone: input.formData.get('timezone'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values: {
          displayName: String(input.formData.get('displayName') ?? ''),
          email: String(input.formData.get('email') ?? ''),
          confirmEmail: String(input.formData.get('confirmEmail') ?? ''),
          phone: String(input.formData.get('phone') ?? ''),
          timezone: String(input.formData.get('timezone') ?? ''),
        },
      } satisfies AuthActionData,
      { status: 400 },
    );
  }

  try {
    const normalizedEmail = normalizeComparableEmail(parsed.data.email);

    await authService.register({
      displayName: parsed.data.displayName,
      email: normalizedEmail,
      password: parsed.data.password,
      phone: parsed.data.phone,
      timezone: parsed.data.timezone,
    });
    const { sessionId } = await authService.login({
      email: normalizedEmail,
      password: parsed.data.password,
    });

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
        values: {
          displayName: parsed.data.displayName,
          email: normalizeComparableEmail(parsed.data.email),
          confirmEmail: normalizeComparableEmail(parsed.data.confirmEmail),
          phone: parsed.data.phone ?? '',
          timezone: parsed.data.timezone ?? '',
        },
      } satisfies AuthActionData,
      { status: 400 },
    );
  }
}
