import { redirect } from 'react-router';
import { flagToggleSchema } from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../utilities/errors';
import { getCreateFlagFormValues } from '../utilities/utils';
import type { FlagIntentHandler } from '../types';

export const handleToggle: FlagIntentHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedToggle = flagToggleSchema.safeParse({
    id: formData.get('id'),
    environment: formData.get('environment'),
  });

  if (!parsedToggle.success) return zodErrorToActionData(parsedToggle.error, formData);

  try {
    await flagRepository.toggle({
      id: parsedToggle.data.id,
      environment: parsedToggle.data.environment,
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
