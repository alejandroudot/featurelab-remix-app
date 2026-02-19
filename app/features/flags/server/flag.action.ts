import { redirect } from 'react-router';
import type { FlagActionResult, RunFlagActionInput } from '../types';
import {
  flagCreateSchema,
  flagDeleteSchema,
  flagToggleSchema,
  flagUpdateStateSchema,
} from '~/core/flags/flags.schema';
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
      type: formData.get('type'),
      rolloutPercent: formData.get('rolloutPercent'),
    });

    if (!parsedCreate.success) return validationToActionData(parsedCreate.error, formData);

    try {
      await flagService.create({
        key: parsedCreate.data.key,
        description: parsedCreate.data.description,
        type: parsedCreate.data.type,
        stateByEnvironment: {
          development: {
            enabled: false,
            rolloutPercent: parsedCreate.data.rolloutPercent,
          },
          production: {
            enabled: false,
            rolloutPercent: parsedCreate.data.rolloutPercent,
          },
        },
      });
      return redirect('/flags');
    } catch (err) {
      if (err instanceof DuplicateFeatureFlagError) {
        return jsonFlagsError(
          {
            formError: 'Ya existe una flag con esa key.',
            values: getCreateFlagFormValues(formData),
          },
          409,
        );
      }

      return jsonFlagsError(
        {
          formError: toFlagFormError(err),
          values: getCreateFlagFormValues(formData),
        },
        500,
      );
    }
  }

  if (intentResult === 'toggle') {
    const parsedToggle = flagToggleSchema.safeParse({
      id: formData.get('id'),
      environment: formData.get('environment'),
    });
    if (!parsedToggle.success) return validationToActionData(parsedToggle.error, formData);
    await flagService.toggle({ id: parsedToggle.data.id, environment: parsedToggle.data.environment });
    return redirect('/flags');
  }

  if (intentResult === 'update-state') {
    const parsedState = flagUpdateStateSchema.safeParse({
      id: formData.get('id'),
      environment: formData.get('environment'),
      rolloutPercent: formData.get('rolloutPercent'),
    });

    if (!parsedState.success) return validationToActionData(parsedState.error, formData);

    await flagService.update({
      id: parsedState.data.id,
      stateByEnvironment: {
        [parsedState.data.environment]: {
          rolloutPercent: parsedState.data.rolloutPercent ?? null,
        },
      },
    });
    return redirect('/flags');
  }

  if (intentResult === 'delete') {
    const parsedDelete = flagDeleteSchema.safeParse({
      id: input.formData.get('id'),
    });

    if (!parsedDelete.success) return validationToActionData(parsedDelete.error, formData);

    await flagService.remove(parsedDelete.data.id);
    return redirect('/flags');
  }
}
