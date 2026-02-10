import { redirect, useLoaderData, useActionData } from 'react-router';
import type { Route } from './+types/flags';
import { z } from 'zod';
import { flagRepository } from '../infra/flags/flags.service';
import { flagCreateSchema } from '../core/flags/flags.schema';
import { DuplicateFeatureFlagError } from '../core/flags/errors';
import { FlagsPage } from '../features/flags/FlagsPage';
import type { FlagsActionData } from '../features/flags/types';
import { requireUser } from "~/infra/auth/require-user";

export async function loader({request}: Route.LoaderArgs) {
	const user = await requireUser(request);
  const flags = await flagRepository.listAll(user.id);
  return { flags };
}

export async function action({ request }: Route.ActionArgs) {
	const user = await requireUser(request);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');

  if (intent === 'toggle') {
    const id = String(formData.get('id') ?? '');
    await flagRepository.toggle(id);
    return redirect('/flags');
  }

  if (intent === 'delete') {
    const id = String(formData.get('id') ?? '');
    await flagRepository.remove(id);
    return redirect('/flags');
  }

  const parsed = flagCreateSchema.safeParse({
    key: formData.get('key'),
    description: formData.get('description'),
    environment: formData.get('environment'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values: {
          key: String(formData.get('key') ?? ''),
          description: String(formData.get('description') ?? ''),
          environment: String(formData.get('environment') ?? ''),
        },
      },
      { status: 400 },
    );
  }

  try {
    await flagRepository.create({...parsed.data, userId: user.id});
    return redirect('/flags');
  } catch (err) {
    if (err instanceof DuplicateFeatureFlagError) {
      return Response.json(
        {
          success: false,
          formError: 'Ya existe una flag con esa key en ese environment.',
          values: parsed.data,
        },
        { status: 409 },
      );
    }
    throw err;
  }
}

export default function FlagsRoute() {
  const { flags } = useLoaderData<typeof loader>();
  const actionData = useActionData() as FlagsActionData;

  return <FlagsPage flags={flags} actionData={actionData} />;
}
