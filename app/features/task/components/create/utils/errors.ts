type FieldErrors = Record<string, string[] | undefined> | undefined;

export function getFieldError(fieldErrors: FieldErrors, key: string) {
  return fieldErrors?.[key]?.[0];
}

export function getFirstFieldError(fieldErrors: FieldErrors) {
  if (!fieldErrors) return undefined;
  for (const key in fieldErrors) {
    const message = fieldErrors[key]?.[0];
    if (message) return message;
  }
  return undefined;
}
