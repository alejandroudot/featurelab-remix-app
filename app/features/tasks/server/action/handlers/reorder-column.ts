import { redirect } from 'react-router';
import { taskReorderColumnSchema } from '~/core/tasks/task.schema';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../../errors';
import { getSafeRedirectTo, getTaskFormValues } from '../../utils';
import type { TaskIntentHandler } from '../shared/types';

export const handleReorderColumn: TaskIntentHandler = async (input) => {
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
