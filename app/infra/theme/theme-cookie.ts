export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_COOKIE_NAME = 'fl_theme';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function parseThemeMode(value: unknown): ThemeMode | null {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }

  return null;
}

export function getThemeFromRequest(request: Request): ThemeMode {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`${THEME_COOKIE_NAME}=([^;]+)`));
  const parsed = parseThemeMode(match?.[1]);
  return parsed ?? 'system';
}

export function buildThemeSetCookie(theme: ThemeMode) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${THEME_COOKIE_NAME}=${theme}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_IN_SECONDS}${secure}`;
}
