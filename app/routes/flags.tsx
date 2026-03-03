import { useLoaderData } from 'react-router';
import type { Route } from './+types/flags';
import { flagRepository } from '~/infra/flags/flag.repository.provider';
import { FlagsPage } from '../features/flags/FlagsPage';
import { requireAdmin } from '~/infra/auth/require-admin';
import { runFlagLoader } from '~/server/flags/loader';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  return runFlagLoader({ flagRepository });
}

export default function FlagsRoute() {
  const { flags } = useLoaderData<typeof loader>();

  return <FlagsPage flags={flags} />;
}

