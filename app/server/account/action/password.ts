import { z } from 'zod';
import type { AccountActionData } from '~/features/account/types';
import { passwordUpdateSchema } from '../schemas';
import type { AccountActionContext } from '../types';

export async function handlePasswordUpdate({
  formData,
  userId,
  authRepository,
}: AccountActionContext) {
  const parsed = passwordUpdateSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        intent: 'password',
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      } satisfies AccountActionData,
      { status: 400 },
    );
  }

  try {
    await authRepository.changePassword({
      userId,
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return Response.json(
        {
          success: false,
          intent: 'password',
          formError: 'Password actual invalida.',
        } satisfies AccountActionData,
        { status: 401 },
      );
    }
    throw error;
  }

  return Response.json(
    {
      success: true,
      intent: 'password',
      message: 'Password actualizada.',
    } satisfies AccountActionData,
    { status: 200 },
  );
}
