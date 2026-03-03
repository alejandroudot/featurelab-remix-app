import {
  taskCommentCreateSchema,
  taskCommentDeleteSchema,
  taskCommentUpdateSchema,
} from '~/core/task/task.schema';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../../errors';
import { getTaskFormValues } from '../../utils';
import { getCommentOrNull, getTaskOrNull } from '../shared/helpers';
import { createMentionActivities } from '../shared/mentions';
import type { TaskIntentHandler } from '../shared/types';

export const handleCommentCreate: TaskIntentHandler = async (input) => {
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

    await input.taskRepository.createComment({
      taskId: parsed.data.id,
      authorUserId: input.userId,
      body: parsed.data.commentBody,
    });

    await input.taskRepository.createActivity({
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
      writer: input.taskRepository,
    });

    return Response.json({ success: true });
  } catch (err) {
    return jsonTaskError({
      intent: 'comment-create',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

export const handleCommentUpdate: TaskIntentHandler = async (input) => {
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

    await input.taskRepository.updateComment({
      id: parsed.data.commentId,
      authorUserId: input.userId,
      body: parsed.data.commentBody,
    });

    await input.taskRepository.createActivity({
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
      writer: input.taskRepository,
    });

    return Response.json({ success: true });
  } catch (err) {
    return jsonTaskError({
      intent: 'comment-update',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};

export const handleCommentDelete: TaskIntentHandler = async (input) => {
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

    await input.taskRepository.removeComment({
      id: parsed.data.commentId,
      authorUserId: input.userId,
    });

    await input.taskRepository.createActivity({
      taskId: comment.taskId,
      actorUserId: input.userId,
      action: 'comment-deleted',
      metadata: { commentId: comment.id },
    });

    return Response.json({ success: true });
  } catch (err) {
    return jsonTaskError({
      intent: 'comment-delete',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};






