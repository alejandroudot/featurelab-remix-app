import type { AuthRepository } from '~/core/auth/auth.port';
import type { AccountActionData } from '~/features/account/types';
import { handlePasswordUpdate } from './action/handlers/password';
import { handleProfileUpdate } from './action/handlers/profile';

type RunAccountActionInput = {
  formData: FormData;
  userId: string;
  authRepository: AuthRepository;
};

export async function runAccountAction({ formData, userId, authRepository }: RunAccountActionInput) {
  const intent = String(formData.get('intent') ?? '');
  const context = { formData, userId, authRepository };

  if (intent === 'profile-update') {
    return handleProfileUpdate(context);
  }

  if (intent === 'password-update') {
    return handlePasswordUpdate(context);
  }

  return Response.json(
    {
      success: false,
      intent: 'profile',
      formError: 'Intent no soportado.',
    } satisfies AccountActionData,
    { status: 400 },
  );
}
