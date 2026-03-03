import { taskReorderColumnSchema } from '~/core/task/task.schema';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../../errors';
import { getTaskFormValues } from '../../utils';
import type { TaskIntentHandler } from '../shared/types';

export const handleReorderColumn: TaskIntentHandler = async (input) => {
  const { formData } = input;
  const parsed = taskReorderColumnSchema.safeParse({
    status: formData.get('status'),
    orderedTaskIds: formData.get('orderedTaskIds'),
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'reorder-column');

  try {
    await input.taskRepository.reorderColumn({
      userId: input.userId,
      status: parsed.data.status,
      orderedTaskIds: parsed.data.orderedTaskIds,
    });
    await Promise.all(
      parsed.data.orderedTaskIds.map((taskId, index) =>
        input.taskRepository.createActivity({
          taskId,
          actorUserId: input.userId,
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





