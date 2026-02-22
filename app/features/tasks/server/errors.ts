import {z} from "zod";
import { getTaskFormValues } from "./utils";
import type { TaskActionData } from "../types";

// Convierte un ZodError al contrato de error que entiende la UI de tasks.
export function validationToActionData(error: z.ZodError, formData: FormData): TaskActionData {
	return {
		success: false,
		fieldErrors: z.flattenError(error).fieldErrors,
		values: getTaskFormValues(formData),
	};
}

// Normaliza errores desconocidos a un mensaje de formulario consistente.
export function toTaskFormError(err: unknown): string {
	if (err instanceof Error) {
		return err.message;
	}
	return 'No se pudo procesar la task. Intenta nuevamente.';
}

// Arma el payload de error final para responses de actions de tasks.
export function jsonTaskError(payload: Pick<NonNullable<TaskActionData>, 'formError' | 'fieldErrors' | 'values'>): TaskActionData {
	return {
		success: false,
		...payload,
	};
}
