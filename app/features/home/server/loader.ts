// doc : prepara datos del servidor para esa vista home en homepage.tsx (shape listo para render).
// lógica server-side del loader de React Router 

import type { FeatureFlagRepository } from '~/core/flags/contracts/flags.port';
import { ensureProductFlagsSeeded } from '~/core/flags/service/flag-seed';
import type { FlagDecisionService } from '~/core/flags/service/flag-decision.service';
import type { UserRole } from '~/core/auth/auth.types';
import type { TaskQueryPort } from '~/core/tasks/task.repository.port';
import type { HomePageProps } from '../types';

type RunHomeLoaderInput = {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
  taskQueryPort: TaskQueryPort;
  flagRepository: Pick<FeatureFlagRepository, 'listAll' | 'create'>;
  flagDecisionService: Pick<FlagDecisionService, 'resolveFlagDecision'>;
};

export async function runHomeLoader(input: RunHomeLoaderInput): Promise<HomePageProps> {
  const { user, taskQueryPort, flagRepository, flagDecisionService } = input;
  await ensureProductFlagsSeeded(flagRepository);

  const environment: 'development' | 'production' =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

  const tasks = await taskQueryPort.listByUser(user.id);
  const ready = tasks.filter((task) => task.status === 'ready-to-go-live').length;
  const closed =
    tasks.filter((task) => task.status === 'done').length +
    tasks.filter((task) => task.status === 'discarded').length;
  const open = tasks.length - closed;

  const byStatus = tasks.reduce(
    (acc, task) => {
      const rawStatus = String(task.status);
      if (rawStatus === 'todo') acc.todo += 1;
      if (rawStatus === 'in-progress') acc.inProgress += 1;
      if (rawStatus === 'qa') acc.qa += 1;
      if (rawStatus === 'ready-to-go-live') acc.readyToGoLive += 1;
      if (rawStatus === 'done') acc.done += 1;
      if (rawStatus === 'discarded') acc.discarded += 1;
      
      return acc;
    },
    { todo: 0, inProgress: 0, qa: 0, readyToGoLive: 0, done: 0, discarded: 0 },
  );

  const flagsSummary =
    user.role === 'admin'
      ? await flagRepository.listAll().then((flags) => {
          const envFlags = flags;
          const resolvedForUser = envFlags.map((flag) =>
            flagDecisionService.resolveFlagDecision({
              key: flag.key,
              environment,
              userId: user.id,
            }),
          );

          return Promise.all(resolvedForUser).then((resolutions) => ({
            environment,
            total: envFlags.length,
            enabled: resolutions.filter((result) => result.enabled).length,
            switches: envFlags.slice(0, 8).map((flag) => ({
              id: flag.id,
              key: flag.key,
              enabled: flag.stateByEnvironment[environment].enabled,
              type: flag.type,
              rolloutPercent: flag.stateByEnvironment[environment].rolloutPercent ?? null,
            })),
          }));
        })
      : undefined;

  const recentActivity = [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)
    .map((task) => {
      const action: HomePageProps['recentActivity'][number]['action'] =
        task.status === 'ready-to-go-live' || task.status === 'done' || task.status === 'discarded'
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


