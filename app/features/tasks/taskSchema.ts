import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
