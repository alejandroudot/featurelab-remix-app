import { z } from 'zod';

// Intent permitido en el endpoint POST /flags.
export const flagIntentSchema = z.enum(['create', 'update-state', 'delete', 'toggle']);

export const flagCreateSchema = z
  .object({
    key: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : ''),
      z
        .string()
        .min(1, 'La key es obligatoria')
        .regex(/^[a-z0-9-]+$/, 'Usa kebab-case: ejemplo "dark-theme"'),
    ),
    description: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : ''),
      z.string().optional(),
    ),
    type: z
      .preprocess(
        (value) => (typeof value === 'string' ? value.trim() : value),
        z.enum(['boolean', 'percentage']).default('boolean'),
      )
      .optional(),
    rolloutPercent: z.preprocess((value) => {
      if (value == null) return undefined;
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      const n = Number(trimmed);
      return Number.isNaN(n) ? value : n;
    }, z.number().int().min(0, 'El porcentaje minimo es 0').max(100, 'El porcentaje maximo es 100').optional()),
  })
  .transform((data) => ({
    key: data.key,
    description: data.description?.length ? data.description : undefined,
    type: (data.type ?? 'boolean') as 'boolean' | 'percentage',
    rolloutPercent: data.rolloutPercent ?? null,
  }));

export const flagToggleSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
  environment: z.enum(['development', 'production']),
});

export const flagUpdateStateSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
  environment: z.enum(['development', 'production']),
  rolloutPercent: z.preprocess((value) => {
    if (value == null) return undefined;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isNaN(n) ? value : n;
  }, z.number().int().min(0, 'El porcentaje minimo es 0').max(100, 'El porcentaje maximo es 100').optional()),
});

// Payload de delete: solo id.
export const flagDeleteSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
});

export type FlagIntentSchema = z.infer<typeof flagIntentSchema>;
