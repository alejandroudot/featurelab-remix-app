import type { User } from '~/core/auth/auth.types';

type RunAccountLoaderInput = {
  user: User;
};

export function runAccountLoader({ user }: RunAccountLoaderInput) {
  return { user };
}
