import { z } from 'zod';

// Intent permitido en el endpoint POST /tasks.
export const taskIntentSchema = z.enum(['create', 'update', 'delete']);

// Payload de update: id + campos editables.
export const taskUpdateSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// Payload de delete: solo id.
export const taskDeleteSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
});

export type TaskIntent = z.infer<typeof taskIntentSchema>;
