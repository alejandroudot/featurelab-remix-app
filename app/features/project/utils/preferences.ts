import type { ProjectViewState } from '~/features/task/types';

type UserPreferencesCookie = {
  density: 'comfortable' | 'compact';
  defaultTasksView: ProjectViewState['view'];
  defaultTasksOrder: ProjectViewState['order'];
  defaultTasksScope: ProjectViewState['scope'];
};

const COOKIE_NAME = 'fl_prefs';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const DEFAULT_PREFERENCES: UserPreferencesCookie = {
  density: 'comfortable',
  defaultTasksView: 'board',
  defaultTasksOrder: 'manual',
  defaultTasksScope: 'all',
};

function readPreferencesFromCookie(): UserPreferencesCookie {
  if (typeof document === 'undefined') return DEFAULT_PREFERENCES;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return DEFAULT_PREFERENCES;

  try {
    const raw = decodeURIComponent(cookie.split('=').slice(1).join('='));
    const parsed = JSON.parse(raw) as Partial<UserPreferencesCookie>;
    return {
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
      defaultTasksView: parsed.defaultTasksView === 'list' ? 'list' : 'board',
      defaultTasksOrder: parsed.defaultTasksOrder === 'priority' ? 'priority' : 'manual',
      defaultTasksScope:
        parsed.defaultTasksScope === 'assigned'
          ? 'assigned'
          : parsed.defaultTasksScope === 'created'
            ? 'created'
            : 'all',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function persistProjectViewPreferences(viewState: ProjectViewState) {
  if (typeof document === 'undefined') return;
  const current = readPreferencesFromCookie();
  const next: UserPreferencesCookie = {
    ...current,
    defaultTasksView: viewState.view,
    defaultTasksOrder: viewState.order,
    defaultTasksScope: viewState.scope,
  };
  const value = encodeURIComponent(JSON.stringify(next));
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`;
}
