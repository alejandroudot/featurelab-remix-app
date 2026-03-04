import { useMutation } from '@tanstack/react-query';
import {
  createTask,
  createTaskComment,
  deleteTask,
  deleteTaskComment,
  reorderColumn,
  updateTask,
  updateTaskComment,
} from './api';

export function useCreateTaskMutation() {
  return useMutation({
    mutationFn: createTask,
  });
}

export function useUpdateTaskMutation() {
  return useMutation({
    mutationFn: updateTask,
  });
}

export function useDeleteTaskMutation() {
  return useMutation({
    mutationFn: deleteTask,
  });
}

export function useReorderColumnMutation() {
  return useMutation({
    mutationFn: reorderColumn,
  });
}

export function useCreateTaskCommentMutation() {
  return useMutation({
    mutationFn: createTaskComment,
  });
}

export function useUpdateTaskCommentMutation() {
  return useMutation({
    mutationFn: updateTaskComment,
  });
}

export function useDeleteTaskCommentMutation() {
  return useMutation({
    mutationFn: deleteTaskComment,
  });
}
