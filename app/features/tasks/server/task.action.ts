import { redirect } from 'react-router';

import {
  taskCreateSchema,
  taskDeleteSchema,
  taskIntentSchema,
  taskUpdateSchema,
} from '~/core/tasks/task.schema';

import type { RunTaskActionInput, TaskActionResult } from '../types';
import { getSafeRedirectTo, getTaskFormValues, parseIntent } from './utils';
import { jsonTaskError, toTaskFormError, validationToActionData } from './errors';

type Intent = (typeof taskIntentSchema)['enum'][keyof (typeof taskIntentSchema)['enum']];
type TaskIntentHandler = (input: RunTaskActionInput) => Promise<TaskActionResult>;

// Handler de creacion: valida payload create y persiste la task.
const handleCreate: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskCreateSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!parsed.success) return validationToActionData(parsed.error, formData);

  try {
    await input.taskCommandService.create({ ...parsed.data, userId: input.userId });
    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

// Handler de update: permite cambios parciales de status/priority/assignee.
const handleUpdate: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskUpdateSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
    priority: formData.get('priority'),
    assigneeId: formData.get('assigneeId'),
  });

  if (!parsed.success) return validationToActionData(parsed.error, formData);

  try {
    await input.taskCommandService.update({
      id: parsed.data.id,
      userId: input.userId,
      status: parsed.data.status,
      priority: parsed.data.priority,
      assigneeId: parsed.data.assigneeId,
    });

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

// Handler de delete: valida id y elimina task del usuario actual.
const handleDelete: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsedDelete = taskDeleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsedDelete.success) return validationToActionData(parsedDelete.error, formData);

  try {
    await input.taskCommandService.remove({
      id: parsedDelete.data.id,
      userId: input.userId,
    });

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

// Tabla de dispatch por intent para evitar if/else encadenados.
const intentHandlers: Record<Intent, TaskIntentHandler> = {
  create: handleCreate,
  update: handleUpdate,
  delete: handleDelete,
};

// Orquestador principal: parsea intent y delega al handler correspondiente.
export async function runTaskAction(input: RunTaskActionInput): Promise<TaskActionResult> {
  const intentResult = parseIntent(input.formData);

  if (typeof intentResult !== 'string') {
    return intentResult;
  }

  const handler = intentHandlers[intentResult as Intent];
  return handler(input);
}
