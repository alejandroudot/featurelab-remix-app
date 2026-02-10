import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Requerido"),
});

export type LoginSchema = z.infer<typeof loginSchema>;