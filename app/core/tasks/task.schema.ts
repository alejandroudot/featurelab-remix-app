import { z } from 'zod';

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

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
