import { useLoaderData } from 'react-router';
import type { Route } from './+types/account';
import { AccountPage } from '~/features/account/AccountPage';
import { runAccountAction } from '~/features/account/server/action';
import { runAccountLoader } from '~/features/account/server/loader';
import { requireUser } from '~/infra/auth/require-user';
import { authRepository } from '~/infra/auth/auth.repository.provider';
import { getThemeFromRequest } from '~/infra/theme/theme-cookie';
import { getUserPreferencesFromRequest } from '~/infra/preferences/preferences-cookie';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const theme = getThemeFromRequest(request);
  const preferences = getUserPreferencesFromRequest(request);
  return runAccountLoader({ user, theme, preferences });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runAccountAction({ formData, userId: user.id, authRepository });
}

export default function AccountRoute() {
  const { user, theme, preferences } = useLoaderData<typeof loader>();
  return <AccountPage user={user} theme={theme} preferences={preferences} />;
}
