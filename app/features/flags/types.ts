import type { FlagCommandService } from '~/core/flags/service/flags.service';
import type { FeatureFlag } from '~/core/flags/contracts/flags.types';

// View model para la UI, derivado del dominio.
export type Flag = FeatureFlag;

export type FlagActionData =
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
  | undefined;

	export type FlagActionResult = Response | FlagActionData;

	export type RunFlagActionInput = {
		formData: FormData;
		flagCommandService: FlagCommandService;
	};
