import { z } from 'zod';
import type { AccountActionData } from '~/features/account/types';
import { profileSchema } from '../../schemas';
import type { AccountActionContext } from '../types';

export async function handleProfileUpdate({
  formData,
  userId,
  authRepository,
}: AccountActionContext) {
  const parsed = profileSchema.safeParse({
    displayName: formData.get('displayName'),
    phone: formData.get('phone'),
    about: formData.get('about'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        intent: 'profile',
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values: {
          displayName: String(formData.get('displayName') ?? ''),
          phone: String(formData.get('phone') ?? ''),
          about: String(formData.get('about') ?? ''),
        },
      } satisfies AccountActionData,
      { status: 400 },
    );
  }

  await authRepository.updateProfile({
    userId,
    displayName: parsed.data.displayName,
    phone: parsed.data.phone ?? null,
    about: parsed.data.about ?? null,
  });

  return Response.json(
    {
      success: true,
      intent: 'profile',
      message: 'Perfil actualizado.',
    } satisfies AccountActionData,
    { status: 200 },
  );
}
