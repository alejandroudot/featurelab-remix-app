export type ActionDataLike = {
  success: boolean;
  intent?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  message?: string;
};

export function getErrorActionDataByIntent<T extends ActionDataLike>(
  actionData: T | undefined,
  intent: string,
) {
  if (!actionData || actionData.success) return undefined;
  if (actionData.intent !== intent) return undefined;
  return actionData;
}

export function getActionFieldError(
  actionData: ActionDataLike | undefined,
  intent: string | undefined,
  fieldKey: string,
) {
  if (!actionData || actionData.success) return undefined;
  if (intent && actionData.intent !== intent) return undefined;
  return actionData.fieldErrors?.[fieldKey]?.[0];
}

export function getActionFormError(actionData: ActionDataLike | undefined, intent?: string) {
  if (!actionData || actionData.success) return undefined;
  if (intent && actionData.intent !== intent) return undefined;
  return actionData.formError;
}

export function getActionSuccessMessage(actionData: ActionDataLike | undefined, intent?: string) {
  if (!actionData || !actionData.success) return undefined;
  if (intent && actionData.intent !== intent) return undefined;
  return actionData.message;
}

type ActionFeedbackTextProps = {
  actionData: ActionDataLike | undefined;
  intent?: string;
  fieldKey?: string;
  fallbackError?: string | null;
  showFormError?: boolean;
  showSuccessMessage?: boolean;
  errorClassName?: string;
  successClassName?: string;
};

export function ActionFeedbackText({
  actionData,
  intent,
  fieldKey,
  fallbackError,
  showFormError = false,
  showSuccessMessage = false,
  errorClassName = 'text-xs text-red-600',
  successClassName = 'text-xs text-emerald-700',
}: ActionFeedbackTextProps) {
  const fieldError = fieldKey ? getActionFieldError(actionData, intent, fieldKey) : undefined;
  const formError = showFormError ? getActionFormError(actionData, intent) : undefined;
  const successMessage = showSuccessMessage ? getActionSuccessMessage(actionData, intent) : undefined;
  const effectiveFallbackError = fieldError ? undefined : fallbackError ?? undefined;

  return (
    <>
      {fieldError ? <p className={errorClassName}>{fieldError}</p> : null}
      {effectiveFallbackError ? <p className={errorClassName}>{effectiveFallbackError}</p> : null}
      {formError ? <p className={errorClassName}>{formError}</p> : null}
      {successMessage ? <p className={successClassName}>{successMessage}</p> : null}
    </>
  );
}
