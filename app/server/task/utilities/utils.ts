import type { TaskActionData } from '~/features/task/types';

const TASK_FORM_VALUE_KEYS = [
  'title',
  'description',
  'projectId',
  'labels',
  'checklist',
  'commentBody',
  'commentId',
  'id',
  'status',
  'priority',
  'dueDate',
  'orderIndex',
  'assigneeId',
  'orderedTaskIds',
] as const;

export function getTaskFormValues(formData: FormData): NonNullable<TaskActionData>['values'] {
  const values: Record<string, string> = {};

  for (const key of TASK_FORM_VALUE_KEYS) {
    const value = formData.get(key);
    if (typeof value === 'string') {
      values[key] = value;
    }
  }

  return values;
}
