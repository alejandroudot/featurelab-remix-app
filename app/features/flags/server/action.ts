import { redirect } from 'react-router';
import type { FlagActionResult, RunFlagActionInput } from '../types';
import { flagCreateSchema, flagDeleteSchema, flagToggleSchema, flagUpdateRolloutSchema } from '~/core/flags/flags.schema';
import { jsonFlagsError, toFlagFormError, validationToActionData } from './errors';
import { DuplicateFeatureFlagError } from '~/core/flags/errors';
import { getCreateFlagFormValues, parseIntent } from './utils';

// Orquesta la action de Flags: valida por intent y delega al service.
export async function runFlagAction(input: RunFlagActionInput): Promise<FlagActionResult> {
  const { formData, flagService } = input;
  const intentResult = parseIntent(input.formData);

  if (typeof intentResult !== 'string') {
    return intentResult;
  }

  if (intentResult === 'create') {
    const parsedCreate = flagCreateSchema.safeParse({
      key: formData.get('key'),
      description: formData.get('description'),
      environment: formData.get('environment'),
      type: formData.get('type'),
      rolloutPercent: formData.get('rolloutPercent'),
    });

    if (!parsedCreate.success) return validationToActionData(parsedCreate.error);

    try {
      await flagService.create(parsedCreate.data);
      return redirect('/flags');
    } catch (err) {
      if (err instanceof DuplicateFeatureFlagError) {
        return jsonFlagsError(
          {
            formError: 'Ya existe una flag con esa key en ese environment.',
            values: getCreateFlagFormValues(formData),
          },
          409,
        );
      }

      return jsonFlagsError(
        {
          formError: toFlagFormError(err),
          values: getCreateFlagFormValues(formData, { environment: 'development' }),
        },
        500,
      );
    }
  }

  if (intentResult === 'toggle') {
    const parsedToggle = flagToggleSchema.safeParse({
      id: formData.get('id'),
    });
    if (!parsedToggle.success) return validationToActionData(parsedToggle.error);
    await flagService.toggle(parsedToggle.data.id);
    return redirect('/flags');
  }

  if (intentResult === 'update-rollout') {
    const id = String(formData.get('id') ?? '');
    const rawPercent = String(formData.get('rolloutPercent') ?? '');

    const parsedPercent = flagUpdateRolloutSchema.safeParse(rawPercent.length ? rawPercent : '0');

    if (!parsedPercent.success) {
      const messages = parsedPercent.error.issues.map((issue) => issue.message);
      return jsonFlagsError(
        {
          fieldErrors: { rolloutPercent: messages },
          values: {
            rolloutPercent: rawPercent,
          },
        },
        400,
      );
    }

    await flagService.update({ id, rolloutPercent: parsedPercent.data });
    return redirect('/flags');
  }

  if (intentResult === 'delete') {
    const parsedDelete = flagDeleteSchema.safeParse({
      id: input.formData.get('id'),
    });

    if (!parsedDelete.success) return validationToActionData(parsedDelete.error);

    await flagService.remove(parsedDelete.data.id);
    return redirect('/flags');
  }
}
