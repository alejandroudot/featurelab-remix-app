import type { FeatureFlagRepository } from '~/core/flags/contracts/flags.port';

export type FlagActionResponseData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: {
        key?: string;
        description?: string;
        type?: string;
        rolloutPercent?: string;
      };
    }
  | {
      success: true;
      message?: string;
    };

export type FlagActionHandlerInput = {
  formData: FormData;
  flagRepository: Pick<FeatureFlagRepository, 'create' | 'toggle' | 'update' | 'remove'>;
};

export type FlagActionHandler = (
  input: FlagActionHandlerInput,
) => Promise<Response | FlagActionResponseData>;
