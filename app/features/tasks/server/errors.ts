import {z} from "zod";
import { getTaskFormValues } from "./utils";
import type { TaskActionData } from "../types";

export function validationToActionData(error: z.ZodError, formData: FormData): TaskActionData {
	return {
		success: false,
		fieldErrors: z.flattenError(error).fieldErrors,
		values: getTaskFormValues(formData),
	};
}

export function toTaskFormError(err: unknown): string {
	if (err instanceof Error) {
		return err.message;
	}
	return 'No se pudo procesar la task. Intenta nuevamente.';
}

export function jsonTaskError(payload: Pick<NonNullable<TaskActionData>, 'formError' | 'fieldErrors' | 'values'>): TaskActionData {
	return {
		success: false,
		...payload,
	};
}