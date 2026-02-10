import { z } from 'zod';

export const taskCreateSchema = z
  .object({
    title: z.preprocess(
      (v) => (typeof v === 'string' ? v.trim() : ''),
      z.string().min(1, 'El título es obligatorio'),
    ),
    description: z.preprocess(
      (v) => (typeof v === 'string' ? v.trim() : ''),
      z.string().optional(),
    ),
  })
  .transform((data) => ({
    title: data.title,
    description: data.description?.length ? data.description : undefined,
  }));

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
