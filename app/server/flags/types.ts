import type { FeatureFlagRepository } from '~/core/flags/contracts/flags.port';
import type { FlagActionData } from '~/features/flags/types';

export type FlagIntentHandlerInput = {
  formData: FormData;
  flagRepository: Pick<FeatureFlagRepository, 'create' | 'toggle' | 'update' | 'remove'>;
};

export type FlagIntentHandler = (
  input: FlagIntentHandlerInput,
) => Promise<Response | FlagActionData>;
