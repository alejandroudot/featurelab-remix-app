import { redirect } from 'react-router';
import { flagDeleteSchema } from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../../errors';
import { getCreateFlagFormValues } from '../../utils';
import type { FlagIntentHandler } from '../types';

export const handleDelete: FlagIntentHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedDelete = flagDeleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsedDelete.success) return zodErrorToActionData(parsedDelete.error, formData);

  try {
    await flagRepository.remove(parsedDelete.data.id);
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
