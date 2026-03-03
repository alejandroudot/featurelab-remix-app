import { useLoaderData, useActionData } from 'react-router';
import type { Route } from './+types/flags';
import { flagRepository } from '~/infra/flags/flag.repository.provider';
import { FlagsPage } from '../features/flags/FlagsPage';
import type { FlagActionData } from '../features/flags/types';
import { requireAdmin } from '~/infra/auth/require-admin';
import { runFlagAction } from '~/server/flags/action';
import { runFlagLoader } from '~/server/flags/loader';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  return runFlagLoader({ flagRepository });
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  // La route solo orquesta; la logica de intents vive en un helper dedicado.
  return runFlagAction({
    formData,
    flagRepository,
  });
}

export default function FlagsRoute() {
  const { flags } = useLoaderData<typeof loader>();
  const actionData = useActionData() as FlagActionData;

  return <FlagsPage flags={flags} actionData={actionData} />;
}

