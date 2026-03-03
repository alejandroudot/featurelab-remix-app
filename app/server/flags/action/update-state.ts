import { redirect } from 'react-router';
import { flagUpdateStateSchema } from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../utilities/errors';
import { getCreateFlagFormValues } from '../utilities/utils';
import type { FlagIntentHandler } from '../types';

export const handleUpdateState: FlagIntentHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedState = flagUpdateStateSchema.safeParse({
    id: formData.get('id'),
    environment: formData.get('environment'),
    rolloutPercent: formData.get('rolloutPercent'),
  });

  if (!parsedState.success) return zodErrorToActionData(parsedState.error, formData);

  try {
    await flagRepository.update({
      id: parsedState.data.id,
      stateByEnvironment: {
        [parsedState.data.environment]: {
          rolloutPercent: parsedState.data.rolloutPercent ?? null,
        },
      },
    });
    return redirect('/flags');
  } catch (err) {
    return jsonFlagsError(
      {
        formError: toFlagFormError(err),
        values: getCreateFlagFormValues(formData),
      },
      500,
    );
  }
};
