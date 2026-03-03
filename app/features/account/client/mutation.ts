import { useMutation } from '@tanstack/react-query';
import { submitPassword, submitProfile } from './api';

export function useProfileMutation() {
  return useMutation({
    mutationFn: submitProfile,
  });
}

export function usePasswordMutation() {
  return useMutation({
    mutationFn: submitPassword,
  });
}
