import { redirect } from 'react-router';
import { z } from 'zod';

import { taskCreateSchema } from '~/core/tasks/task.schema';
import {
  taskDeleteSchema,
  taskIntentSchema,
  taskUpdateSchema,
  type TaskIntent,
} from '~/core/tasks/task.action.schema';
import type { RunTaskActionInput, TaskActionData, TaskActionResult } from '../types';


function validationToActionData(error: z.ZodError): TaskActionData {
  return {
    success: false,
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

function parseIntent(formData: FormData): TaskIntent | TaskActionData {
  const parsedIntent = taskIntentSchema.safeParse(formData.get('intent'));
  if (!parsedIntent.success) {
    return {
      success: false,
      fieldErrors: { intent: ['Intent invalido'] },
    };
  }
  return parsedIntent.data;
}

// Orquesta la action de tasks: valida por intent y delega al service.
export async function runTaskAction(input: RunTaskActionInput): Promise<TaskActionResult> {
  const intentResult = parseIntent(input.formData);
  if (typeof intentResult !== 'string') {
    return intentResult;
  }

  if (intentResult === 'create') {
    const parsed = taskCreateSchema.safeParse({
      title: input.formData.get('title'),
      description: input.formData.get('description'),
    });

    if (!parsed.success) return validationToActionData(parsed.error);

    await input.taskService.create({ ...parsed.data, userId: input.userId });
    return redirect('/tasks');
  }

  if (intentResult === 'update') {
    const parsed = taskUpdateSchema.safeParse({
      id: input.formData.get('id'),
      status: input.formData.get('status'),
      priority: input.formData.get('priority'),
    });

    if (!parsed.success) return validationToActionData(parsed.error);

    await input.taskService.update({
      id: parsed.data.id,
      userId: input.userId,
      status: parsed.data.status,
      priority: parsed.data.priority,
    });

    return redirect('/tasks');
  }

  const parsedDelete = taskDeleteSchema.safeParse({
    id: input.formData.get('id'),
  });

  if (!parsedDelete.success) return validationToActionData(parsedDelete.error);

  await input.taskService.remove({
    id: parsedDelete.data.id,
    userId: input.userId,
  });

  return redirect('/tasks');
}
