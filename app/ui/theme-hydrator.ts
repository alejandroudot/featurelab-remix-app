import { useEffect } from 'react';
import { useThemeStore } from '~/ui/theme.store';

function resolveSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeHydrator() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (mode: 'light' | 'dark') => {
      if (mode === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    };

    if (theme === 'system') {
      apply(resolveSystemTheme());

      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply(media.matches ? 'dark' : 'light');

      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    apply(theme);
  }, [theme]);

  return null;
}
