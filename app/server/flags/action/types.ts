import { flagIntentSchema } from '~/core/flags/contracts/flags.schema';
import type { FlagActionResult, RunFlagActionInput } from '~/features/flags/types';

export type Intent = (typeof flagIntentSchema)['enum'][keyof (typeof flagIntentSchema)['enum']];
export type FlagIntentHandler = (input: RunFlagActionInput) => Promise<FlagActionResult>;
