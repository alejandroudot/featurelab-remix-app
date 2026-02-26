import { redirect } from 'react-router';

import {
  taskCommentCreateSchema,
  taskCommentDeleteSchema,
  taskCommentUpdateSchema,
  taskCreateSchema,
  taskDeleteSchema,
  taskIntentSchema,
  taskReorderColumnSchema,
  taskUpdateSchema,
} from '~/core/tasks/task.schema';

import type { RunTaskActionInput, TaskActionResult } from '../types';
import { getSafeRedirectTo, getTaskFormValues, parseIntent } from './utils';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from './errors';
import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';
import {
  cleanupRichTextTempImagesNotInPersistedHtml,
  finalizeRichTextTempImagesInHtml,
} from '~/infra/files/rich-text-images.storage';

type Intent = (typeof taskIntentSchema)['enum'][keyof (typeof taskIntentSchema)['enum']];
type TaskIntentHandler = (input: RunTaskActionInput) => Promise<TaskActionResult>;

async function getTaskOrNull(input: RunTaskActionInput, taskId: string) {
  return input.taskQueryService.getByIdForUser({ id: taskId, userId: input.userId });
}

async function getCommentOrNull(input: RunTaskActionInput, commentId: string) {
  return input.taskCommentQueryService.getByIdForUser({ id: commentId, userId: input.userId });
}

function labelsEqual(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((label, index) => label === right[index]);
}

function checklistEqual(
  left: Array<{ id: string; text: string; done: boolean }>,
  right: Array<{ id: string; text: string; done: boolean }>,
) {
  if (left.length !== right.length) return false;
  return left.every(
    (item, index) =>
      item.id === right[index]?.id &&
      item.text === right[index]?.text &&
      item.done === right[index]?.done,
  );
}

function extractMentionTokens(text: string | null | undefined): string[] {
  if (!text) return [];
  const atTokens = (text.match(/@([a-zA-Z0-9._%+-]+)/g) ?? []).map((token) =>
    token.slice(1).toLowerCase(),
  );
  return [...new Set(atTokens)];
}

async function resolveMentionedUserIds(tokens: string[]): Promise<string[]> {
  if (tokens.length === 0) return [];
  const tokenSet = new Set(tokens.map((token) => token.toLowerCase()));

  const rows = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .all();

  return rows
    .filter((row) => {
      const email = row.email.toLowerCase();
      const localPart = email.split('@')[0] ?? '';
      return tokenSet.has(email) || tokenSet.has(localPart);
    })
    .map((row) => row.id);
}

async function createMentionActivities(input: {
  taskId: string;
  actorUserId: string;
  source: 'comment' | 'description';
  text: string | null | undefined;
  skipNotificationForUserId?: string;
  writer: RunTaskActionInput['taskActivityCommandService'];
}) {
  const mentionTokens = extractMentionTokens(input.text);
  const mentionedUserIds = await resolveMentionedUserIds(mentionTokens);
  // Evita auto-notificacion cuando el actor se menciona a si mismo.
  const usersToNotify = input.skipNotificationForUserId
    ? mentionedUserIds.filter((userId) => userId !== input.skipNotificationForUserId)
    : mentionedUserIds;

  await Promise.all(
    usersToNotify.map((targetUserId) =>
      input.writer.create({
        taskId: input.taskId,
        actorUserId: input.actorUserId,
        action: 'updated',
        metadata: {
          kind: 'mention',
          source: input.source,
          targetUserId,
        },
      }),
    ),
  );
}

// Handler de creacion: valida payload create y persiste la task.
const handleCreate: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const rawDescription = String(formData.get('description') ?? '');
  const description = rawDescription
    ? await finalizeRichTextTempImagesInHtml(rawDescription)
    : rawDescription;
  const parsed = taskCreateSchema.safeParse({
    title: formData.get('title'),
    description,
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
    await createMentionActivities({
      taskId: createdTask.id,
      actorUserId: input.userId,
      source: 'description',
      text: createdTask.description ?? null,
      skipNotificationForUserId: input.userId,
      writer: input.taskActivityCommandService,
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
    title: formData.get('title'),
    description: formData.get('description'),
    labels: formData.get('labels'),
    checklist: formData.get('checklist'),
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
      title: parsed.data.title,
      description: parsed.data.description,
      labels: parsed.data.labels,
      checklist: parsed.data.checklist,
      dueDate: parsed.data.dueDate,
      status: parsed.data.status,
      priority: parsed.data.priority,
      orderIndex: parsed.data.orderIndex,
      assigneeId: parsed.data.assigneeId,
    });

    // Si la descripcion cambió, limpiamos imagenes tmp que quedaron fuera del nuevo contenido.
    const beforeDescription = task.description ?? '';
    const afterDescription = updatedTask.description ?? '';
    if (beforeDescription !== afterDescription) {
      await cleanupRichTextTempImagesNotInPersistedHtml(beforeDescription, afterDescription);
    }

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
    if (!checklistEqual(task.checklist, updatedTask.checklist)) {
      const doneCount = updatedTask.checklist.filter((item) => item.done).length;
      activityWrites.push(
        input.taskActivityCommandService.create({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'checklist-changed',
          metadata: {
            total: updatedTask.checklist.length,
            done: doneCount,
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
    const beforeDescriptionForMentions = task.description ?? null;
    const afterDescriptionForMentions = updatedTask.description ?? null;
    if (beforeDescriptionForMentions !== afterDescriptionForMentions) {
      await createMentionActivities({
        taskId: updatedTask.id,
        actorUserId: input.userId,
        source: 'description',
        text: updatedTask.description ?? null,
        skipNotificationForUserId: input.userId,
        writer: input.taskActivityCommandService,
      });
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

const handleCommentCreate: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskCommentCreateSchema.safeParse({
    id: formData.get('id'),
    commentBody: formData.get('commentBody'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'comment-create');

  try {
    const task = await getTaskOrNull(input, parsed.data.id);
    if (!task) {
      return jsonTaskError({
        intent: 'comment-create',
        formError: 'No tenes permisos para comentar esta task.',
        values: getTaskFormValues(formData),
      });
    }

    await input.taskCommentCommandService.create({
      taskId: parsed.data.id,
      authorUserId: input.userId,
      body: parsed.data.commentBody,
    });

    await input.taskActivityCommandService.create({
      taskId: parsed.data.id,
      actorUserId: input.userId,
      action: 'comment-added',
    });
    await createMentionActivities({
      taskId: parsed.data.id,
      actorUserId: input.userId,
      source: 'comment',
      text: parsed.data.commentBody,
      skipNotificationForUserId: input.userId,
      writer: input.taskActivityCommandService,
    });

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'comment-create',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

const handleCommentUpdate: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskCommentUpdateSchema.safeParse({
    commentId: formData.get('commentId'),
    commentBody: formData.get('commentBody'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'comment-update');

  try {
    const comment = await getCommentOrNull(input, parsed.data.commentId);
    if (!comment) {
      return jsonTaskError({
        intent: 'comment-update',
        formError: 'No tenes permisos para editar este comentario.',
        values: getTaskFormValues(formData),
      });
    }

    if (comment.authorUserId !== input.userId) {
      return jsonTaskError({
        intent: 'comment-update',
        formError: 'Solo el autor puede editar su comentario.',
        values: getTaskFormValues(formData),
      });
    }

    await input.taskCommentCommandService.update({
      id: parsed.data.commentId,
      authorUserId: input.userId,
      body: parsed.data.commentBody,
    });

    await input.taskActivityCommandService.create({
      taskId: comment.taskId,
      actorUserId: input.userId,
      action: 'comment-updated',
      metadata: { commentId: comment.id },
    });
    await createMentionActivities({
      taskId: comment.taskId,
      actorUserId: input.userId,
      source: 'comment',
      text: parsed.data.commentBody,
      skipNotificationForUserId: input.userId,
      writer: input.taskActivityCommandService,
    });

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'comment-update',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

const handleCommentDelete: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskCommentDeleteSchema.safeParse({
    commentId: formData.get('commentId'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'comment-delete');

  try {
    const comment = await getCommentOrNull(input, parsed.data.commentId);
    if (!comment) {
      return jsonTaskError({
        intent: 'comment-delete',
        formError: 'No tenes permisos para eliminar este comentario.',
        values: getTaskFormValues(formData),
      });
    }

    if (comment.authorUserId !== input.userId) {
      return jsonTaskError({
        intent: 'comment-delete',
        formError: 'Solo el autor puede eliminar su comentario.',
        values: getTaskFormValues(formData),
      });
    }

    await input.taskCommentCommandService.remove({
      id: parsed.data.commentId,
      authorUserId: input.userId,
    });

    await input.taskActivityCommandService.create({
      taskId: comment.taskId,
      actorUserId: input.userId,
      action: 'comment-deleted',
      metadata: { commentId: comment.id },
    });

    return redirect(getSafeRedirectTo(formData, '/tasks'));
  } catch (err) {
    return jsonTaskError({
      intent: 'comment-delete',
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
  'comment-create': handleCommentCreate,
  'comment-update': handleCommentUpdate,
  'comment-delete': handleCommentDelete,
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
