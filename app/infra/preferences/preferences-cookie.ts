import { z } from 'zod';
import { getCookieValue } from '~/infra/http/cookies';

// Contrato unico de preferencias permitidas en cliente/server.
export const userPreferencesSchema = z.object({
  defaultTasksView: z.enum(['board', 'list']).default('board'),
  defaultTasksOrder: z.enum(['manual', 'priority']).default('manual'),
  defaultTasksScope: z.enum(['all', 'assigned', 'created']).default('all'),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultTasksView: 'board',
  defaultTasksOrder: 'manual',
  defaultTasksScope: 'all',
};

const USER_PREFERENCES_COOKIE_NAME = 'fl_prefs';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function getUserPreferencesFromRequest(request: Request): UserPreferences {
  // Lee preferencias de cookie; si faltan o son invalidas, cae en defaults seguros.
  const cookie = request.headers.get('cookie') ?? '';
  const rawValue = getCookieValue(cookie, USER_PREFERENCES_COOKIE_NAME);
  if (!rawValue) return DEFAULT_USER_PREFERENCES;

  try {
    const parsed = userPreferencesSchema.safeParse(JSON.parse(decodeURIComponent(rawValue)));
    if (!parsed.success) return DEFAULT_USER_PREFERENCES;
    return parsed.data;
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function buildUserPreferencesSetCookie(preferences: UserPreferences) {
  // Valida/normaliza antes de persistir para no guardar estados corruptos.
  const safe = userPreferencesSchema.parse(preferences);
  const value = encodeURIComponent(JSON.stringify(safe));
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${USER_PREFERENCES_COOKIE_NAME}=${value}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_IN_SECONDS}${secure}`;
}
