import { z } from 'zod';

	// Intent permitido en el endpoint POST /tasks.
export const taskIntentSchema = z.enum(['create', 'update', 'delete']);

// Schema exclusivo para crear tasks (intent=create).
export const taskCreateSchema = z
  .object({
    title: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : ''),
      z.string().min(1, 'El titulo es obligatorio'),
    ),
    description: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : ''),
      z.string().optional(),
    ),
  })
  .transform((data) => ({
    title: data.title,
    description: data.description?.length ? data.description : undefined,
  }));

// Payload de update: id + campos editables.
export const taskUpdateSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
  status: z.enum(['todo', 'in-progress', 'qa', 'ready-to-go-live']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// Payload de delete: solo id.
export const taskDeleteSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
});

export type TaskIntentSchema = z.infer<typeof taskIntentSchema>;
