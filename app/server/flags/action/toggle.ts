import { flagToggleSchema } from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../utilities/errors';
import type { FlagActionHandler } from '../types';

export const handleToggle: FlagActionHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedToggle = flagToggleSchema.safeParse({
    id: formData.get('id'),
    environment: formData.get('environment'),
  });

  if (!parsedToggle.success) return zodErrorToActionData(parsedToggle.error);

  try {
    await flagRepository.toggle({
      id: parsedToggle.data.id,
      environment: parsedToggle.data.environment,
    });
    return Response.json({
      success: true,
      message: 'Flag actualizada.',
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
