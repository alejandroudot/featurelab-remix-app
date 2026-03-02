import { redirect } from 'react-router';
import { taskDeleteSchema } from '~/core/task/task.schema';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../../errors';
import { getSafeRedirectTo, getTaskFormValues } from '../../utils';
import { getTaskOrNull } from '../shared/helpers';
import type { TaskIntentHandler } from '../shared/types';

export const handleDelete: TaskIntentHandler = async (input) => {
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

    await input.taskPort.activity.create({
      taskId: parsedDelete.data.id,
      actorUserId: input.userId,
      action: 'deleted',
    });

    await input.taskPort.task.remove({
      id: parsedDelete.data.id,
      userId: input.userId,
    });

    return redirect(getSafeRedirectTo(formData, '/'));
  } catch (err) {
    return jsonTaskError({
      intent: 'delete',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};






