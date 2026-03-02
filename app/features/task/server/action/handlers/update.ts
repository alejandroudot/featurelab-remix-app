import { taskUpdateSchema } from '~/core/task/task.schema';
import { cleanupRichTextTempImagesNotInPersistedHtml } from '~/infra/files/rich-text-images.storage';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../../errors';
import { getSafeRedirectTo, getTaskFormValues } from '../../utils';
import { checklistEqual, labelsEqual } from '../shared/compare';
import { getTaskOrNull } from '../shared/helpers';
import { createMentionActivities } from '../shared/mentions';
import type { TaskIntentHandler } from '../shared/types';
import { redirect } from 'react-router';

export const handleUpdate: TaskIntentHandler = async (input) => {
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

    const updatedTask = await input.taskRepository.update({
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

    const beforeDescription = task.description ?? '';
    const afterDescription = updatedTask.description ?? '';
    if (beforeDescription !== afterDescription) {
      await cleanupRichTextTempImagesNotInPersistedHtml(beforeDescription, afterDescription);
    }

    const activityWrites: Array<Promise<void>> = [];
    if (!labelsEqual(task.labels, updatedTask.labels)) {
      activityWrites.push(
        input.taskRepository.createActivity({
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
        input.taskRepository.createActivity({
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
        input.taskRepository.createActivity({
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
        input.taskRepository.createActivity({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'status-changed',
          metadata: { from: task.status, to: updatedTask.status },
        }),
      );
    }
    if (task.priority !== updatedTask.priority) {
      activityWrites.push(
        input.taskRepository.createActivity({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'priority-changed',
          metadata: { from: task.priority, to: updatedTask.priority },
        }),
      );
    }
    if ((task.assigneeId ?? null) !== (updatedTask.assigneeId ?? null)) {
      activityWrites.push(
        input.taskRepository.createActivity({
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
        input.taskRepository.createActivity({
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
        writer: input.taskRepository,
      });
    }

    if (activityWrites.length === 0) {
      activityWrites.push(
        input.taskRepository.createActivity({
          taskId: updatedTask.id,
          actorUserId: input.userId,
          action: 'updated',
        }),
      );
    }
    await Promise.all(activityWrites);

    return redirect(getSafeRedirectTo(formData, '/'));
  } catch (err) {
    return jsonTaskError({
      intent: 'update',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};





