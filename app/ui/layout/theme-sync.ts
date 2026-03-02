import type { ThemeMode } from '~/infra/theme/theme-cookie';

export const THEME_MODE_CHANGED_EVENT = 'fl-theme-mode-changed';

export function applyThemeModeAndNotify(nextTheme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle('dark', nextTheme === 'dark');
  root.style.colorScheme = nextTheme === 'dark' ? 'dark' : 'light';
  document.cookie = `fl_theme=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.dispatchEvent(
    new CustomEvent(THEME_MODE_CHANGED_EVENT, {
      detail: { theme: nextTheme },
    }),
  );
  document.dispatchEvent(
    new CustomEvent(THEME_MODE_CHANGED_EVENT, {
      detail: { theme: nextTheme },
    }),
  );
}
