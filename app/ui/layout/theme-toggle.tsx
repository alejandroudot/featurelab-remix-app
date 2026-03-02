import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '~/infra/theme/theme-cookie';
import { applyThemeModeAndNotify } from '~/ui/theme/theme-sync';
import { Switch } from '~/ui/primitives/switch';

export function ThemeToggle({ theme }: { theme: ThemeMode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(theme);

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  const isDark = themeMode === 'dark';

  function handleToggle(checked: boolean) {
    const nextTheme: ThemeMode = checked ? 'dark' : 'light';
    applyThemeModeAndNotify(nextTheme);
    setThemeMode(nextTheme);
  }

  return (
    <Switch
      tone="theme"
      className="h-5.5 w-10 hover:ring-1 hover:ring-indigo-400/60 dark:hover:ring-indigo-500/60"
      thumbClassName="size-[18px] data-[state=unchecked]:bg-white data-[state=checked]:bg-zinc-900 dark:data-[state=unchecked]:bg-zinc-900 dark:data-[state=checked]:bg-white"
      checked={isDark}
      onCheckedChange={handleToggle}
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
