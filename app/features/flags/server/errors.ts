import { z } from 'zod';
import type { FlagActionData } from '../types';
import { getCreateFlagFormValues } from './utils';

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

export function toFlagFormError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return 'No se pudo crear la flag. Intenta nuevamente.';
}

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
