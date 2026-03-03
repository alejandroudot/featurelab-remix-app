import { taskCreateSchema } from '~/core/task/task.schema';
import { finalizeRichTextTempImagesInHtml } from '~/infra/files/rich-text-images.storage';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../utilities/errors';
import { getTaskFormValues } from '../utilities/utils';
import { createMentionActivities } from '../utilities/mentions';
import type { TaskIntentHandler } from '../types';

export const handleCreate: TaskIntentHandler = async (input) => {
  const { formData, taskRepository, userId } = input;
  const rawDescription = String(formData.get('description') ?? '');
  const description = rawDescription
    ? await finalizeRichTextTempImagesInHtml(rawDescription)
    : rawDescription;
  const parsed = taskCreateSchema.safeParse({
    projectId: formData.get('projectId'),
    title: formData.get('title'),
    description,
  });

  if (!parsed.success) return zodErrorToActionData(parsed.error, formData, 'create');

  try {
    const createdTask = await taskRepository.create({ ...parsed.data, userId: userId });
    await taskRepository.createActivity({
      taskId: createdTask.id,
      actorUserId: userId,
      action: 'created',
    });
    await createMentionActivities({
      taskId: createdTask.id,
      actorUserId: userId,
      source: 'description',
      text: createdTask.description ?? null,
      skipNotificationForUserId: userId,
      writer: taskRepository,
    });
    return Response.json({ success: true });
  } catch (err) {
    return jsonTaskError({
      intent: 'create',
      formError: toTaskFormError(err),
      values: getTaskFormValues(formData),
    });
  }
};






