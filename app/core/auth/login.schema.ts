import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email invalido'),
  password: z.string().min(1, 'Requerido'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
