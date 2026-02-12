import { redirect, useLoaderData, useActionData } from 'react-router';
import type { Route } from './+types/flags';
import { z } from 'zod';
import { flagService } from '../infra/flags/flags.repository';
import { flagCreateSchema } from '../core/flags/flags.schema';
import { DuplicateFeatureFlagError } from '../core/flags/errors';
import { FlagsPage } from '../features/flags/FlagsPage';
import type { FlagsActionData } from '../features/flags/types';
import { requireAdmin } from '~/infra/auth/require-admin';

function toFlagFormError(err: unknown): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase();

    // Compatibilidad con DB legacy cuando venimos del modelo user_flags.
    if (
      message.includes('feature_flags.user_id') ||
      message.includes('no column named type') ||
      message.includes('no column named rollout_percent')
    ) {
      return 'La tabla feature_flags está desactualizada respecto al código actual. Ejecuta migraciones o recrea la DB local.';
    }

    return err.message;
  }

  return 'No se pudo crear la flag. Intenta nuevamente.';
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const flags = await flagService.listAll();
  return { flags };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');

  if (intent === 'toggle') {
    const id = String(formData.get('id') ?? '');
    await flagService.toggle(id);
    return redirect('/flags');
  }

  if (intent === 'delete') {
    const id = String(formData.get('id') ?? '');
    await flagService.remove(id);
    return redirect('/flags');
  }

  if (intent === 'update-rollout') {
    const id = String(formData.get('id') ?? '');
    const rawPercent = String(formData.get('rolloutPercent') ?? '');

    const rolloutSchema = z.coerce
      .number()
      .int()
      .min(0, 'El porcentaje mínimo es 0')
      .max(100, 'El porcentaje máximo es 100');

    const parsedPercent = rolloutSchema.safeParse(rawPercent.length ? rawPercent : '0');

    if (!parsedPercent.success) {
      const messages = parsedPercent.error.issues.map((issue) => issue.message);
      return Response.json(
        {
          success: false,
          fieldErrors: { rolloutPercent: messages },
          values: {
            rolloutPercent: rawPercent,
          },
        } satisfies FlagsActionData,
        { status: 400 },
      );
    }

    await flagService.update({ id, rolloutPercent: parsedPercent.data });
    return redirect('/flags');
  }

  if (intent !== 'create') {
    return Response.json(
      {
        success: false,
        formError: `Intent desconocido: "${intent}"`,
      } satisfies FlagsActionData,
      { status: 400 },
    );
  }

  const parsed = flagCreateSchema.safeParse({
    key: formData.get('key'),
    description: formData.get('description'),
    environment: formData.get('environment'),
    type: formData.get('type'),
    rolloutPercent: formData.get('rolloutPercent'),
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
          type: String(formData.get('type') ?? 'boolean'),
          rolloutPercent: String(formData.get('rolloutPercent') ?? ''),
        },
      },
      { status: 400 },
    );
  }

  try {
    await flagService.create(parsed.data);
    return redirect('/flags');
  } catch (err) {
    if (err instanceof DuplicateFeatureFlagError) {
      return Response.json(
        {
          success: false,
          formError: 'Ya existe una flag con esa key en ese environment.',
          values: {
            key: String(formData.get('key') ?? ''),
            description: String(formData.get('description') ?? ''),
            environment: String(formData.get('environment') ?? ''),
            type: String(formData.get('type') ?? 'boolean'),
            rolloutPercent: String(formData.get('rolloutPercent') ?? ''),
          },
        },
        { status: 409 },
      );
    }
    return Response.json(
      {
        success: false,
        formError: toFlagFormError(err),
        values: {
          key: String(formData.get('key') ?? ''),
          description: String(formData.get('description') ?? ''),
          environment: String(formData.get('environment') ?? 'development'),
          type: String(formData.get('type') ?? 'boolean'),
          rolloutPercent: String(formData.get('rolloutPercent') ?? ''),
        },
      } satisfies FlagsActionData,
      { status: 500 },
    );
  }
}

export default function FlagsRoute() {
  const { flags } = useLoaderData<typeof loader>();
  const actionData = useActionData() as FlagsActionData;

  return <FlagsPage flags={flags} actionData={actionData} />;
}
