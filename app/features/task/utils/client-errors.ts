import type { TaskActionData } from '../types';

export function getTaskActionToastError(actionData: TaskActionData): string | null {
  if (!actionData || actionData.success !== false) return null;

  // Create ya tiene render inline de errores en el formulario.
  if (actionData.intent === 'create') return null;

  const firstFieldError = actionData.fieldErrors
    ? Object.values(actionData.fieldErrors).find((messages) => messages?.[0])?.[0]
    : undefined;

  return actionData.formError ?? firstFieldError ?? 'No se pudo guardar el cambio.';
}

