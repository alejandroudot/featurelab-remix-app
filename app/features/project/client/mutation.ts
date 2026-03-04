import { useMutation } from '@tanstack/react-query';
import { createProject, deleteProject } from './api';

export function useCreateProjectMutation() {
  return useMutation({
    mutationFn: createProject,
  });
}

export function useDeleteProjectMutation() {
  return useMutation({
    mutationFn: deleteProject,
  });
}
