import { flagUpdateStateSchema } from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, zodErrorToActionData } from '../utilities/errors';
import type { FlagActionHandler } from '../types';

export const handleUpdateState: FlagActionHandler = async (input) => {
  const { formData, flagRepository } = input;
  const parsedState = flagUpdateStateSchema.safeParse({
    id: formData.get('id'),
    environment: formData.get('environment'),
    rolloutPercent: formData.get('rolloutPercent'),
  });

  if (!parsedState.success) return zodErrorToActionData(parsedState.error);

  try {
    await flagRepository.update({
      id: parsedState.data.id,
      stateByEnvironment: {
        [parsedState.data.environment]: {
          rolloutPercent: parsedState.data.rolloutPercent ?? null,
        },
      },
    });
    return Response.json({
      success: true,
      message: 'Estado de flag actualizado.',
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
