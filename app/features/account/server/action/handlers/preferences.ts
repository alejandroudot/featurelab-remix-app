import { z } from 'zod';
import type { AccountActionData } from '~/features/account/types';
import {
  buildUserPreferencesSetCookie,
  userPreferencesSchema,
} from '~/infra/preferences/preferences-cookie';
import { buildThemeSetCookie, parseThemeMode } from '~/infra/theme/theme-cookie';
import type { AccountActionContext } from '../types';

export async function handlePreferencesUpdate({ formData }: AccountActionContext) {
  const parsedPreferences = userPreferencesSchema.safeParse({
    density: formData.get('density') ?? undefined,
    defaultTasksView: formData.get('defaultTasksView') ?? undefined,
    defaultTasksOrder: formData.get('defaultTasksOrder') ?? undefined,
    defaultTasksScope: formData.get('defaultTasksScope') ?? undefined,
  });
  const parsedTheme = parseThemeMode(formData.get('theme'));

  if (!parsedPreferences.success || !parsedTheme) {
    const fieldErrors: Record<string, string[] | undefined> = parsedPreferences.success
      ? {}
      : { ...z.flattenError(parsedPreferences.error).fieldErrors };

    if (!parsedTheme) {
      fieldErrors.theme = ['Tema invalido'];
    }

    return Response.json(
      {
        success: false,
        intent: 'preferences',
        fieldErrors,
        values: {
          density: String(formData.get('density') ?? ''),
          defaultTasksView: String(formData.get('defaultTasksView') ?? ''),
          defaultTasksOrder: String(formData.get('defaultTasksOrder') ?? ''),
          defaultTasksScope: String(formData.get('defaultTasksScope') ?? ''),
          theme: String(formData.get('theme') ?? ''),
        },
      } satisfies AccountActionData,
      { status: 400 },
    );
  }

  const preferencesCookie = buildUserPreferencesSetCookie(parsedPreferences.data);
  const themeCookie = buildThemeSetCookie(parsedTheme);
  const headers = new Headers();
  headers.append('Set-Cookie', preferencesCookie);
  headers.append('Set-Cookie', themeCookie);

  return Response.json(
    {
      success: true,
      intent: 'preferences',
      message: 'Preferencias actualizadas.',
      values: {
        theme: parsedTheme,
        density: parsedPreferences.data.density,
        defaultTasksView: parsedPreferences.data.defaultTasksView,
        defaultTasksOrder: parsedPreferences.data.defaultTasksOrder,
        defaultTasksScope: parsedPreferences.data.defaultTasksScope,
      },
    } satisfies AccountActionData,
    { status: 200, headers },
  );
}
