import { z } from 'zod';
import type { FlagActionData } from '../types';
import { getCreateFlagFormValues } from './utils';

// Convierte un ZodError al contrato de error que consume la UI de flags.
export function validationToActionData(
  error: z.ZodError,
  formData?: FormData,
): FlagActionData {
  return {
    success: false,
    fieldErrors: z.flattenError(error).fieldErrors,
    values: formData ? getCreateFlagFormValues(formData) : undefined,
  };
}

// Normaliza errores desconocidos a un mensaje de formulario consistente.
export function toFlagFormError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return 'No se pudo crear la flag. Intenta nuevamente.';
}

// Construye la respuesta JSON de error con status HTTP explicito.
export function jsonFlagsError(
  payload: Pick<NonNullable<FlagActionData>, 'formError' | 'fieldErrors' | 'values'>,
  status: number,
) {
  return Response.json(
    {
      success: false,
      ...payload,
    } satisfies FlagActionData,
    { status },
  );
}
