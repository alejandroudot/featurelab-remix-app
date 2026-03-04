import { flagDeleteSchema } from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../utilities/errors';
import type { FlagActionHandler } from '../types';

export const handleDelete: FlagActionHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedDelete = flagDeleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsedDelete.success) return zodErrorToActionData(parsedDelete.error);

  try {
    await flagRepository.remove(parsedDelete.data.id);
    return Response.json({
      success: true,
      message: 'Flag eliminada.',
    });
  } catch (err) {
    return jsonFlagsError(
      {
        formError: toFlagFormError(err),
      },
      500,
    );
  }
};
