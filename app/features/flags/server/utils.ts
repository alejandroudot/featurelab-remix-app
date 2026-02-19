import type { FlagActionData } from "../types";
import { flagIntentSchema, type FlagIntentSchema } from "~/core/flags/flags.schema";

export function getCreateFlagFormValues(formData: FormData) {
  return {
    key: String(formData.get('key') ?? ''),
    description: String(formData.get('description') ?? ''),
    type: String(formData.get('type') ?? 'boolean'),
    rolloutPercent: String(formData.get('rolloutPercent') ?? ''),
  };
}

export function parseIntent(formData: FormData): FlagIntentSchema | FlagActionData {
	const parsedIntent = flagIntentSchema.safeParse(formData.get('intent'));
	if (!parsedIntent.success) {
		return {
			success: false,
			fieldErrors: { intent: ['Intent invalido'] },
		};
	}
	return parsedIntent.data;
}
