import { Moon, Sun } from 'lucide-react';
import { Switch } from '~/ui/primitives/switch';
import { useThemeStore } from '~/ui/theme.store';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const isDark = theme === 'dark';

  return (
    <Switch
      className="h-5.5 w-10 hover:ring-1 hover:ring-indigo-400/60 dark:hover:ring-indigo-500/60"
      thumbClassName="size-[18px]"
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
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
