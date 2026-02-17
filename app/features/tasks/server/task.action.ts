import { redirect } from 'react-router';

import {
  taskCreateSchema,
  taskDeleteSchema,
  taskUpdateSchema,
} from '~/core/tasks/task.schema';

import type { RunTaskActionInput, TaskActionResult } from '../types';
import { getSafeRedirectTo, getTaskFormValues, parseIntent } from './utils';
import { jsonTaskError, toTaskFormError, validationToActionData } from './errors';

// Orquesta la action de tasks: valida por intent y delega al service.
export async function runTaskAction(input: RunTaskActionInput): Promise<TaskActionResult> {
  const { formData } = input;
  const intentResult = parseIntent(formData);

  if (typeof intentResult !== 'string') {
    return intentResult;
  }

  if (intentResult === 'create') {
    const parsed = taskCreateSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
    });

    if (!parsed.success) return validationToActionData(parsed.error, formData);

    try {
      await input.taskService.create({ ...parsed.data, userId: input.userId });
      return redirect(getSafeRedirectTo(formData, '/tasks'));
    } catch (err) {
      return jsonTaskError({
        formError: toTaskFormError(err),
        values: getTaskFormValues(formData),
      });
    }
  }

  if (intentResult === 'update') {
    const parsed = taskUpdateSchema.safeParse({
      id: formData.get('id'),
      status: formData.get('status'),
      priority: formData.get('priority'),
    });

    if (!parsed.success) return validationToActionData(parsed.error, formData);

    try {
      await input.taskService.update({
        id: parsed.data.id,
        userId: input.userId,
        status: parsed.data.status,
        priority: parsed.data.priority,
      });

      return redirect('/tasks');
    } catch (err) {
      return jsonTaskError({
        formError: toTaskFormError(err),
        values: getTaskFormValues(formData),
      });
    }
  }

  const parsedDelete = taskDeleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsedDelete.success) return validationToActionData(parsedDelete.error, formData);

  try {
    await input.taskService.remove({
      id: parsedDelete.data.id,
      userId: input.userId,
    });

    return redirect('/tasks');
  } catch (err) {
    return jsonTaskError({
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
}
