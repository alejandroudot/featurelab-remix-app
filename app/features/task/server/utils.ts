import { taskIntentSchema, type TaskIntentSchema } from '~/core/task/task.schema';
import type { TaskActionData } from '../types';

// Extrae valores del form para repintar inputs cuando hay errores de validacion.
export function getTaskFormValues(formData: FormData): NonNullable<TaskActionData>['values'] {
  return {
    id: String(formData.get('id') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    labels: String(formData.get('labels') ?? ''),
    checklist: String(formData.get('checklist') ?? ''),
    commentBody: String(formData.get('commentBody') ?? ''),
    commentId: String(formData.get('commentId') ?? ''),
    status: String(formData.get('status') ?? ''),
    priority: String(formData.get('priority') ?? ''),
    dueDate: String(formData.get('dueDate') ?? ''),
    orderIndex: String(formData.get('orderIndex') ?? ''),
    assigneeId: String(formData.get('assigneeId') ?? ''),
    orderedTaskIds: String(formData.get('orderedTaskIds') ?? ''),
  };
}

// Valida el intent y retorna error de contrato si llega un valor invalido.
export function parseIntent(formData: FormData): TaskIntentSchema | TaskActionData {
  const parsedIntent = taskIntentSchema.safeParse(formData.get('intent'));
  if (!parsedIntent.success) {
    return {
      success: false,
      intent: 'unknown',
      fieldErrors: { intent: ['Intent invalido'] },
      values: getTaskFormValues(formData),
    };
  }
  return parsedIntent.data;
}

// Sanitiza redirectTo para evitar redirecciones externas o paths invalidos.
export function getSafeRedirectTo(formData: FormData, fallback = '/'): string {
  const raw = String(formData.get('redirectTo') ?? '').trim();
  if (!raw) return fallback;

  // Permite solo paths internos absolutos del sitio.
  if (!raw.startsWith('/')) return fallback;
  if (raw.startsWith('//')) return fallback;

  return raw;
}





