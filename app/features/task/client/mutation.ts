import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  createTaskComment,
  deleteTask,
  deleteTaskComment,
  reorderColumn,
  updateTask,
  updateTaskComment,
} from './api';
import { isSuccessfulMutation } from '~/lib/query/mutation-result';

const notificationsQueryKey = ['notifications'] as const;

function useInvalidateNotificationsOnSuccess() {
  const queryClient = useQueryClient();
  return async (result: { success?: boolean } | null | undefined) => {
    if (!isSuccessfulMutation(result)) return;
    await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
  };
}

export function useCreateTaskMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: createTask,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}

export function useUpdateTaskMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}

export function useDeleteTaskMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}

export function useReorderColumnMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: reorderColumn,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}

export function useCreateTaskCommentMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: createTaskComment,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}

export function useUpdateTaskCommentMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: updateTaskComment,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}

export function useDeleteTaskCommentMutation() {
  const invalidateNotificationsOnSuccess = useInvalidateNotificationsOnSuccess();
  return useMutation({
    mutationFn: deleteTaskComment,
    onSuccess: invalidateNotificationsOnSuccess,
  });
}
