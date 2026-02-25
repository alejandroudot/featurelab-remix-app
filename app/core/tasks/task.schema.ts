import { z } from 'zod';

const TASK_STATUS_VALUES = ['todo', 'in-progress', 'qa', 'ready-to-go-live', 'done', 'discarded'] as const;
const BOARD_STATUS_VALUES = ['todo', 'in-progress', 'qa', 'ready-to-go-live'] as const;

// Intent permitido en el endpoint POST /tasks.
export const taskIntentSchema = z.enum(['create', 'update', 'delete', 'reorder-column']);

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
  status: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return undefined;
      const parsed = value.trim();
      return parsed.length > 0 ? parsed : undefined;
    },
    z.enum(TASK_STATUS_VALUES).optional(),
  ),
  priority: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return undefined;
      const parsed = value.trim();
      return parsed.length > 0 ? parsed : undefined;
    },
    z.enum(['low', 'medium', 'high', 'critical']).optional(),
  ),
  orderIndex: z.preprocess((value) => {
    if (value == null) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return undefined;
    const parsed = value.trim();
    if (!parsed) return undefined;
    const n = Number(parsed);
    return Number.isNaN(n) ? undefined : n;
  }, z.number().int().min(0).optional()),
  assigneeId: z
    .preprocess((value) => {
      if (value == null) return undefined;
      if (typeof value !== 'string') return undefined;
      const parsed = value.trim();
      return parsed.length > 0 ? parsed : null;
    }, z.string().min(1).nullable().optional()),
  dueDate: z.preprocess((value) => {
    if (value == null) return undefined;
    if (typeof value !== 'string') return undefined;
    const parsed = value.trim();
    if (!parsed) return null;
    // type=date envia YYYY-MM-DD; guardamos UTC para estabilidad SSR.
    const nextDate = new Date(`${parsed}T00:00:00.000Z`);
    return Number.isNaN(nextDate.getTime()) ? undefined : nextDate;
  }, z.date().nullable().optional()),
});

// Reordena una columna del board: recibe el status de la columna y un JSON string
// con el array de ids en el orden final que queda despues del drag and drop.
export const taskReorderColumnSchema = z.object({
  status: z.enum(BOARD_STATUS_VALUES),
  orderedTaskIds: z.preprocess((value) => {
    if (typeof value !== 'string') return [];
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }, z.array(z.string().min(1))),
});

// Payload de delete: solo id.
export const taskDeleteSchema = z.object({
  id: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'ID requerido'),
  ),
});

export type TaskIntentSchema = z.infer<typeof taskIntentSchema>;
