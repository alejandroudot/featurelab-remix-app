import { taskCreateSchema } from '~/core/task/task.schema';
import { finalizeRichTextTempImagesInHtml } from '~/infra/files/rich-text-images.storage';
import { jsonTaskError, toTaskFormError, zodErrorToActionData } from '../../errors';
import { getTaskFormValues } from '../../utils';
import { createMentionActivities } from '../shared/mentions';
import type { TaskIntentHandler } from '../shared/types';

export const handleCreate: TaskIntentHandler = async (input) => {
  const { formData } = input;
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
    const createdTask = await input.taskRepository.create({ ...parsed.data, userId: input.userId });
    await input.taskRepository.createActivity({
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
      writer: input.taskRepository,
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






