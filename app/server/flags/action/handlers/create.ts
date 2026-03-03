import { redirect } from 'react-router';
import { flagCreateSchema } from '~/core/flags/contracts/flags.schema';
import { DuplicateFeatureFlagError } from '~/core/flags/contracts/errors';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../../errors';
import { getCreateFlagFormValues } from '../../utils';
import type { FlagIntentHandler } from '../types';

export const handleCreate: FlagIntentHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedCreate = flagCreateSchema.safeParse({
    key: formData.get('key'),
    description: formData.get('description'),
    type: formData.get('type'),
    rolloutPercent: formData.get('rolloutPercent'),
  });

  if (!parsedCreate.success) return zodErrorToActionData(parsedCreate.error, formData);

  try {
    await flagRepository.create({
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
};
