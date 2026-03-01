import { z } from 'zod';
import type { AuthService } from '~/core/auth/auth.port';
import { passwordPolicySchema } from '~/core/auth/password.schema';
import type { AccountActionData } from '../types';

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Minimo 2 caracteres')
    .max(60, 'Maximo 60 caracteres'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === '' ? undefined : value))
    .pipe(
      z
        .string()
        .regex(/^\+?[0-9 ()-]{8,20}$/, 'Telefono invalido')
        .optional(),
    ),
  about: z
    .string()
    .trim()
    .max(500, 'Maximo 500 caracteres')
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Requerido'),
    newPassword: passwordPolicySchema,
    confirmPassword: z.string().min(1, 'Requerido'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las passwords no coinciden',
  });

type RunAccountActionInput = {
  formData: FormData;
  userId: string;
  authService: AuthService;
};

export async function runAccountAction({
  formData,
  userId,
  authService,
}: RunAccountActionInput) {
  const intent = String(formData.get('intent') ?? '');

  if (intent === 'profile-update') {
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

    await authService.updateProfile({
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

  if (intent === 'password-update') {
    const parsed = passwordSchema.safeParse({
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
      await authService.changePassword({
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

  return Response.json(
    {
      success: false,
      intent: 'profile',
      formError: 'Intent no soportado.',
    } satisfies AccountActionData,
    { status: 400 },
  );
}
