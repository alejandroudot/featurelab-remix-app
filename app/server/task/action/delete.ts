import { taskDeleteSchema } from '~/core/task/task.schema';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../utilities/errors';
import { getTaskFormValues } from '../utilities/utils';
import type { TaskIntentHandler } from '../types';

export const handleDelete: TaskIntentHandler = async (input) => {
  const { formData, taskRepository, userId } = input;
  const parsedDelete = taskDeleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsedDelete.success) return zodErrorToActionData(parsedDelete.error, formData, 'delete');

  try {
    const task = await taskRepository.getByIdForUser({ id: parsedDelete.data.id, userId: userId });
    if (!task) {
      return jsonTaskError({
        intent: 'delete',
        formError: 'No tenes permisos para eliminar esta task.',
        values: getTaskFormValues(formData),
      });
    }

    const isCreator = task.userId === userId;
    if (!isCreator) {
      return jsonTaskError({
        intent: 'delete',
        formError: 'Solo el creador puede eliminar esta task.',
        values: getTaskFormValues(formData),
      });
    }

    await taskRepository.createActivity({
      taskId: parsedDelete.data.id,
      actorUserId: userId,
      action: 'deleted',
    });

    await taskRepository.remove({
      id: parsedDelete.data.id,
      userId: userId,
    });

    return Response.json({ success: true });
  } catch (err) {
    return jsonTaskError({
      intent: 'delete',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};






