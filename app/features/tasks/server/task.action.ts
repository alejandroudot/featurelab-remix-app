import { redirect } from 'react-router';

import {
  taskCreateSchema,
  taskDeleteSchema,
  taskIntentSchema,
  taskReorderColumnSchema,
  taskUpdateSchema,
} from '~/core/tasks/task.schema';

import type { RunTaskActionInput, TaskActionResult } from '../types';
import { getSafeRedirectTo, getTaskFormValues, parseIntent } from './utils';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from './errors';

type Intent = (typeof taskIntentSchema)['enum'][keyof (typeof taskIntentSchema)['enum']];
type TaskIntentHandler = (input: RunTaskActionInput) => Promise<TaskActionResult>;

async function getTaskOrNull(input: RunTaskActionInput, taskId: string) {
  return input.taskQueryService.getByIdForUser({ id: taskId, userId: input.userId });
}

function labelsEqual(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((label, index) => label === right[index]);
}

// Handler de creacion: valida payload create y persiste la task.
const handleCreate: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskCreateSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'create');

  try {
		// crea la tarea y actualiza el historial
    const createdTask = await input.taskCommandService.create({ ...parsed.data, userId: input.userId });
    await input.taskActivityCommandService.create({
      taskId: createdTask.id,
      actorUserId: input.userId,
      action: 'created',
    });
    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'create',
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
    labels: formData.get('labels'),
    status: formData.get('status'),
    priority: formData.get('priority'),
    orderIndex: formData.get('orderIndex'),
    assigneeId: formData.get('assigneeId'),
    dueDate: formData.get('dueDate'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'update');

  try {
    const task = await getTaskOrNull(input, parsed.data.id);
    if (!task) {
      return jsonTaskError({
        intent: 'update',
        formError: 'No tenes permisos para editar esta task.',
        values: getTaskFormValues(formData),
      });
    }

    const isCreator = task.userId === input.userId;
    const nextAssigneeId = parsed.data.assigneeId;
    const currentAssigneeId = task.assigneeId ?? null;
    const isChangingAssignee =
      nextAssigneeId !== undefined && nextAssigneeId !== currentAssigneeId;
    if (!isCreator && isChangingAssignee) {
      return jsonTaskError({
        intent: 'update',
        formError: 'Solo el creador puede reasignar responsable.',
        values: getTaskFormValues(formData),
      });
    }

    const updatedTask = await input.taskCommandService.update({
      id: parsed.data.id,
      userId: input.userId,
      labels: parsed.data.labels,
      dueDate: parsed.data.dueDate,
      status: parsed.data.status,
      priority: parsed.data.priority,
      orderIndex: parsed.data.orderIndex,
      assigneeId: parsed.data.assigneeId,
    });

    const activityWrites: Array<Promise<void>> = [];
    if (!labelsEqual(task.labels, updatedTask.labels)) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'labels-changed',
          metadata: {
            from: task.labels.join(', '),
            to: updatedTask.labels.join(', '),
          },
        }),
      );
    }
    const beforeDueDate = task.dueDate?.getTime() ?? null;
    const afterDueDate = updatedTask.dueDate?.getTime() ?? null;
    if (beforeDueDate !== afterDueDate) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'due-date-changed',
          metadata: {
            from: task.dueDate ? task.dueDate.toISOString() : null,
            to: updatedTask.dueDate ? updatedTask.dueDate.toISOString() : null,
          },
        }),
      );
    }
    if (task.status !== updatedTask.status) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'status-changed',
          metadata: { from: task.status, to: updatedTask.status },
        }),
      );
    }
    if (task.priority !== updatedTask.priority) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'priority-changed',
          metadata: { from: task.priority, to: updatedTask.priority },
        }),
      );
    }
    if ((task.assigneeId ?? null) !== (updatedTask.assigneeId ?? null)) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'assignee-changed',
          metadata: {
            from: task.assigneeId ?? null,
            to: updatedTask.assigneeId ?? null,
          },
        }),
      );
      if (updatedTask.assigneeId) {
        activityWrites.push(
          input.notificationService.notifyTaskAssigned({
            taskId: updatedTask.id,
            taskTitle: updatedTask.title,
            actorUserId: input.userId,
            assigneeUserId: updatedTask.assigneeId,
          }),
        );
      }
    }
    if (task.orderIndex !== updatedTask.orderIndex) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'reordered',
          metadata: { from: task.orderIndex, to: updatedTask.orderIndex },
        }),
      );
    }

    if (activityWrites.length === 0) {
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'updated',
        }),
      );
    }
    await Promise.all(activityWrites);

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'update',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

// Handler de reorder-column: persiste orden manual de una columna.
const handleReorderColumn: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskReorderColumnSchema.safeParse({
    status: formData.get('status'),
    orderedTaskIds: formData.get('orderedTaskIds'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'reorder-column');

  try {
    await input.taskCommandService.reorderColumn({
      userId: input.userId,
      status: parsed.data.status,
      orderedTaskIds: parsed.data.orderedTaskIds,
    });
    await Promise.all(
      parsed.data.orderedTaskIds.map((taskId, index) =>
        input.taskActivityCommandService.create({
          taskId,
          actorUserId: input.userId,
          action: 'reordered',
          metadata: { status: parsed.data.status, orderIndex: index },
        }),
      ),
    );

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'reorder-column',
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

  if (!parsedDelete.success) return zodErrorToActionData(parsedDelete.error, formData, 'delete');

  try {
    const task = await getTaskOrNull(input, parsedDelete.data.id);
    if (!task) {
      return jsonTaskError({
        intent: 'delete',
        formError: 'No tenes permisos para eliminar esta task.',
        values: getTaskFormValues(formData),
      });
    }

    const isCreator = task.userId === input.userId;
    if (!isCreator) {
      return jsonTaskError({
        intent: 'delete',
        formError: 'Solo el creador puede eliminar esta task.',
        values: getTaskFormValues(formData),
      });
    }

    await input.taskActivityCommandService.create({
      taskId: parsedDelete.data.id,
      actorUserId: input.userId,
      action: 'deleted',
    });

    await input.taskCommandService.remove({
      id: parsedDelete.data.id,
      userId: input.userId,
    });

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'delete',
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
  'reorder-column': handleReorderColumn,
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
