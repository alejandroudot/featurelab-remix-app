import { useMutation } from '@tanstack/react-query';
import { createProject, deleteProject, pinProject, reorderProjectSidebar, updateProject } from './api';

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

export function usePinProjectMutation() {
  return useMutation({
    mutationFn: pinProject,
  });
}

export function useReorderProjectSidebarMutation() {
  return useMutation({
    mutationFn: reorderProjectSidebar,
  });
}

export function useUpdateProjectMutation() {
  return useMutation({
    mutationFn: updateProject,
  });
}
