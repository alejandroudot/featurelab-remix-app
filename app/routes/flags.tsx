import { useLoaderData, useActionData } from 'react-router';
import type { Route } from './+types/flags';
import { flagService } from '../infra/flags/flags.repository';
import { FlagsPage } from '../features/flags/FlagsPage';
import type { FlagActionData } from '../features/flags/types';
import { requireAdmin } from '~/infra/auth/require-admin';
import { runFlagAction } from '~/features/flags/server/action';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const flags = await flagService.listAll();
  return { flags };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  // La route solo orquesta; la logica de intents vive en un helper dedicado.
  return runFlagAction({
    formData,
    flagService,
  });
}

export default function FlagsRoute() {
  const { flags } = useLoaderData<typeof loader>();
  const actionData = useActionData() as FlagActionData;

  return <FlagsPage flags={flags} actionData={actionData} />;
}
