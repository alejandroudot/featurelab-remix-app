import { z } from 'zod';
import { passwordPolicySchema } from '~/core/auth/password.schema';

export const profileSchema = z.object({
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

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Requerido'),
    newPassword: passwordPolicySchema,
    confirmPassword: z.string().min(1, 'Requerido'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las passwords no coinciden',
  });
