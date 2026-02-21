// doc : prepara datos del servidor para esa vista home en homepage.tsx (shape listo para render).
// lógica server-side del loader de React Router 

import type { FlagService } from '~/core/flags/flags.service';
import { ensureProductFlagsSeeded } from '~/core/flags/flag-seed';
import type { TaskService } from '~/core/tasks/tasks.port';
import type { HomePageProps } from '../types';

type RunHomeLoaderInput = {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
  taskService: TaskService;
  flagService: FlagService;
};

export async function runHomeLoader(input: RunHomeLoaderInput): Promise<HomePageProps> {
  const { user, taskService, flagService } = input;
  await ensureProductFlagsSeeded(flagService);

  const environment: 'development' | 'production' =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

  const tasks = await taskService.listByUser(user.id);
  const ready = tasks.filter((task) => task.status === 'ready-to-go-live').length;
  const open = tasks.length - ready;

  const byStatus = tasks.reduce(
    (acc, task) => {
      const rawStatus = String(task.status);
      if (rawStatus === 'todo') acc.todo += 1;
      if (rawStatus === 'in-progress') acc.inProgress += 1;
      if (rawStatus === 'qa') acc.qa += 1;
      if (rawStatus === 'ready-to-go-live') acc.readyToGoLive += 1;
      
      return acc;
    },
    { todo: 0, inProgress: 0, qa: 0, readyToGoLive: 0 },
  );

  const flagsSummary =
    user.role === 'admin'
      ? await flagService.listAll().then((flags) => {
          const envFlags = flags;
          return {
            environment,
            total: envFlags.length,
            enabled: envFlags.filter((flag) => flag.stateByEnvironment[environment].enabled).length,
            switches: envFlags.slice(0, 8).map((flag) => ({
              id: flag.id,
              key: flag.key,
              enabled: flag.stateByEnvironment[environment].enabled,
              type: flag.type,
              rolloutPercent: flag.stateByEnvironment[environment].rolloutPercent ?? null,
            })),
          };
        })
      : undefined;

  const recentActivity = [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)
    .map((task) => {
      const action: HomePageProps['recentActivity'][number]['action'] =
        task.status === 'ready-to-go-live'
          ? 'ha cerrado'
          : task.updatedAt.getTime() === task.createdAt.getTime()
            ? 'ha creado'
            : 'ha actualizado';

      return {
        id: `${task.id}-${task.updatedAt.toISOString()}`,
        taskId: task.id,
        taskTitle: task.title,
        action,
        actor: user.email,
        timestamp: task.updatedAt.toISOString(),
      };
    });

  return {
    env: {
      mode: process.env.NODE_ENV ?? 'development',
      dbProvider: process.env.DB_PROVIDER ?? 'sqlite',
    },
    stats: {
      total: tasks.length,
      open,
      ready,
      byStatus,
    },
    recentActivity,
    flagsSummary,
    user: {
      role: user.role,
    },
  };
}
