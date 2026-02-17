import { taskIntentSchema, type TaskIntentSchema } from '~/core/tasks/task.schema';
import type { TaskActionData } from '../types';

export function getTaskFormValues(formData: FormData): NonNullable<TaskActionData>['values'] {
  return {
    id: String(formData.get('id') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    status: String(formData.get('status') ?? ''),
    priority: String(formData.get('priority') ?? ''),
  };
}

export function parseIntent(formData: FormData): TaskIntentSchema | TaskActionData {
  const parsedIntent = taskIntentSchema.safeParse(formData.get('intent'));
  if (!parsedIntent.success) {
    return {
      success: false,
      fieldErrors: { intent: ['Intent invalido'] },
      values: getTaskFormValues(formData),
    };
  }
  return parsedIntent.data;
}

export function getSafeRedirectTo(formData: FormData, fallback = '/tasks'): string {
  const raw = String(formData.get('redirectTo') ?? '').trim();
  if (!raw) return fallback;

  // Permite solo paths internos absolutos del sitio.
  if (!raw.startsWith('/')) return fallback;
  if (raw.startsWith('//')) return fallback;

  return raw;
}
