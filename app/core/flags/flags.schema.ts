import { z } from 'zod';

export const flagCreateSchema = z
  .object({
    key: z.preprocess(
      (v) => (typeof v === 'string' ? v.trim() : ''),
      z
        .string()
        .min(1, 'La key es obligatoria')
        .regex(/^[a-z0-9-]+$/, 'Usá kebab-case: ejemplo "dark-theme"'),
    ),
    description: z.preprocess(
      (v) => (typeof v === 'string' ? v.trim() : ''),
      z.string().optional(),
    ),
    environment: z.enum(['development', 'production']).default('development'),
  })
  .transform((data) => ({
    key: data.key,
    description: data.description?.length ? data.description : undefined,
    environment: data.environment,
  }));

export type FlagCreateInput = z.infer<typeof flagCreateSchema>;
