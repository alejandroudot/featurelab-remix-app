import { z } from 'zod';

export const registerSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;