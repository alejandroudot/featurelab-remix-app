import type { AuthRepository } from '~/core/auth/auth.port';

export type AccountActionContext = {
  formData: FormData;
  userId: string;
  authRepository: AuthRepository;
};
