import { z } from 'zod';
import { areEquivalentEmails } from './credential-utils';
import { passwordPolicySchema } from './password.schema';

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Minimo 2 caracteres').max(60, 'Maximo 60 caracteres'),
    email: z.email('Email invalido'),
    confirmEmail: z.email('Email invalido'),
    password: passwordPolicySchema,
    confirmPassword: z.string().min(1, 'Requerido'),
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
    timezone: z
      .string()
      .trim()
      .min(1, 'Requerido')
      .max(80, 'Maximo 80 caracteres')
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
  })
  .refine((values) => areEquivalentEmails(values.email, values.confirmEmail), {
    path: ['confirmEmail'],
    message: 'Los emails no coinciden',
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las passwords no coinciden',
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
