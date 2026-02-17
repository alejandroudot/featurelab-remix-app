import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ThemeMode } from '~/infra/theme/theme-cookie';
import { Switch } from '~/ui/primitives/switch';

type ThemeToggleProps = {
  theme: ThemeMode;
};

export function ThemeToggle({ theme }: ThemeToggleProps) {
  const [localTheme, setLocalTheme] = useState<ThemeMode>(theme);
  const isDark = localTheme === 'dark';

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const updateTheme = (nextTheme: ThemeMode) => {
    setLocalTheme(nextTheme);

    const root = document.documentElement;
    root.classList.toggle('dark', nextTheme === 'dark');
    root.style.colorScheme = nextTheme === 'dark' ? 'dark' : 'light';
    document.cookie = `fl_theme=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  return (
    <Switch
      tone="theme"
      className="h-5.5 w-10 hover:ring-1 hover:ring-indigo-400/60 dark:hover:ring-indigo-500/60"
      thumbClassName="size-4 bg-white"
      checked={isDark}
      onCheckedChange={(checked) => updateTheme(checked ? 'dark' : 'light')}
      aria-label="Toggle dark mode"
      thumbContent={
        isDark ? (
          <Moon className="size-2.5 text-indigo-400" aria-hidden="true" />
        ) : (
          <Sun className="size-2.5 text-amber-500" aria-hidden="true" />
        )
      }
    />
  );
}
