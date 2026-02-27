import type { RunTaskActionInput } from '../../../types';

export async function getTaskOrNull(input: RunTaskActionInput, taskId: string) {
  return input.taskQueryService.getByIdForUser({ id: taskId, userId: input.userId });
}

export async function getCommentOrNull(input: RunTaskActionInput, commentId: string) {
  return input.taskCommentQueryService.getByIdForUser({ id: commentId, userId: input.userId });
}
