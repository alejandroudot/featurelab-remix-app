import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFlag, deleteFlag, toggleFlag, updateFlagState } from './api';
import { flagsQueryKey } from './query';

export function useCreateFlagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFlag,
    onSuccess: async (data) => {
      if (!data || !data.success) return;
      await queryClient.invalidateQueries({ queryKey: flagsQueryKey });
    },
  });
}

export function useToggleFlagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFlag,
    onSuccess: async (data) => {
      if (!data || !data.success) return;
      await queryClient.invalidateQueries({ queryKey: flagsQueryKey });
    },
  });
}

export function useUpdateFlagStateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFlagState,
    onSuccess: async (data) => {
      if (!data || !data.success) return;
      await queryClient.invalidateQueries({ queryKey: flagsQueryKey });
    },
  });
}

export function useDeleteFlagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFlag,
    onSuccess: async (data) => {
      if (!data || !data.success) return;
      await queryClient.invalidateQueries({ queryKey: flagsQueryKey });
    },
  });
}
