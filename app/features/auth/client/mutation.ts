import { useMutation } from '@tanstack/react-query';
import { submitLogin, submitRegister } from './api';

export function useLoginMutation() {
  return useMutation({
    mutationFn: submitLogin,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: submitRegister,
  });
}
