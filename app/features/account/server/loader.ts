import type { User } from '~/core/auth/auth.types';
import type { ThemeMode } from '~/infra/theme/theme-cookie';
import type { UserPreferences } from '~/infra/preferences/preferences-cookie';

type RunAccountLoaderInput = {
  user: User;
  theme: ThemeMode;
  preferences: UserPreferences;
};

export function runAccountLoader({ user, theme, preferences }: RunAccountLoaderInput) {
  return { user, theme, preferences };
}
