type FieldErrors = Record<string, string[] | undefined> | undefined;
type ActionDataWithFieldErrors =
  | {
    success: boolean;
    fieldErrors?: Record<string, string[] | undefined>;
  }
  | undefined;

function isActionDataWithFieldErrors(
  input: FieldErrors | ActionDataWithFieldErrors,
): input is Exclude<ActionDataWithFieldErrors, undefined> {
  return (
    Boolean(input) &&
    typeof input === 'object' &&
    'success' in input &&
    typeof (input as { success?: unknown }).success === 'boolean'
  );
}

function resolveFieldErrors(input: FieldErrors | ActionDataWithFieldErrors): FieldErrors {
  if (isActionDataWithFieldErrors(input)) {
    return input.success === false ? input.fieldErrors : undefined;
  }
  return input;
}

export function getFieldError(input: FieldErrors | ActionDataWithFieldErrors, key: string) {
  const fieldErrors = resolveFieldErrors(input);
  return fieldErrors?.[key]?.[0];
}

export function getFirstFieldError(input: FieldErrors | ActionDataWithFieldErrors) {
  const fieldErrors = resolveFieldErrors(input);
  if (!fieldErrors) return undefined;
  for (const key in fieldErrors) {
    const message = fieldErrors[key]?.[0];
    if (message) return message;
  }
  return undefined;
}
