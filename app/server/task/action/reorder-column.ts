import { taskReorderColumnSchema } from '~/core/task/task.schema';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../utilities/errors';
import { getTaskFormValues } from '../utilities/utils';
import type { TaskIntentHandler } from '../types';

export const handleReorderColumn: TaskIntentHandler = async (input) => {
  const { formData, taskRepository, userId } = input;
  const parsed = taskReorderColumnSchema.safeParse({
    status: formData.get('status'),
    orderedTaskIds: formData.get('orderedTaskIds'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'reorder-column');

  try {
    await taskRepository.reorderColumn({
      userId: userId,
      status: parsed.data.status,
      orderedTaskIds: parsed.data.orderedTaskIds,
    });
    await Promise.all(
      parsed.data.orderedTaskIds.map((taskId, index) =>
        taskRepository.createActivity({
          taskId,
          actorUserId: userId,
          action: 'reordered',
          metadata: { status: parsed.data.status, orderIndex: index },
        }),
      ),
    );

    return Response.json({ success: true });
  } catch (err) {
    return jsonTaskError({
      intent: 'reorder-column',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};





