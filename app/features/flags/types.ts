import type { FeatureFlag } from '~/core/flags/flags.types';

// View model para la UI, derivado del dominio.
export type Flag = FeatureFlag;

export type FlagsActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: {
        key?: string;
        description?: string;
        environment?: string;
        type?: string;
        rolloutPercent?: string;
      };
    }
  | undefined;

