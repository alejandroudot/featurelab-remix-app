import type { RunTaskActionInput } from '~/features/task/types';

export async function getTaskOrNull(input: RunTaskActionInput, taskId: string) {
  return input.taskRepository.getByIdForUser({ id: taskId, userId: input.userId });
}

export async function getCommentOrNull(input: RunTaskActionInput, commentId: string) {
  return input.taskRepository.getCommentByIdForUser({ id: commentId, userId: input.userId });
}
