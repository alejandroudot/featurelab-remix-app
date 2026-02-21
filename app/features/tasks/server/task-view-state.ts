import { z } from 'zod';

const tasksViewSearchParamsSchema = z.object({
  view: z.enum(['list', 'board']).default('board'),
  order: z.enum(['manual', 'priority']).default('manual'),
});

export type TasksViewState = z.infer<typeof tasksViewSearchParamsSchema>;

export function parseTasksViewStateFromUrl(url: URL): TasksViewState {
  const parsed = tasksViewSearchParamsSchema.safeParse({
    view: url.searchParams.get('view') ?? undefined,
    order: url.searchParams.get('order') ?? undefined,
  });

  if (!parsed.success) {
    return {
      view: 'board',
      order: 'manual',
    };
  }

  return parsed.data;
}
