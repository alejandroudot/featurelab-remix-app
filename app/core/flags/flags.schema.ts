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
    type: z
      .preprocess(
        (v) => (typeof v === 'string' ? v.trim() : v),
        z.enum(['boolean', 'percentage']).default('boolean'),
      )
      .optional(),
    rolloutPercent: z.preprocess(
      (v) => {
        if (v == null) return undefined;
        if (typeof v !== 'string') return v;
        const trimmed = v.trim();
        if (!trimmed) return undefined;
        const n = Number(trimmed);
        return Number.isNaN(n) ? v : n;
      },
      z
        .number()
        .int()
        .min(0, 'El porcentaje mínimo es 0')
        .max(100, 'El porcentaje máximo es 100')
        .optional(),
    ),
  })
  .transform((data) => ({
    key: data.key,
    description: data.description?.length ? data.description : undefined,
    environment: data.environment,
    type: (data.type ?? 'boolean') as 'boolean' | 'percentage',
    rolloutPercent: data.rolloutPercent ?? null,
  }));

export type FlagCreateInput = z.infer<typeof flagCreateSchema>;
