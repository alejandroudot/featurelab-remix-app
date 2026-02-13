import { useLoaderData } from 'react-router';
import type { Route } from '../+types/root';

import { HomePage } from '~/features/home/HomePage';
import type { HomePageProps } from '~/features/home/types';
import { requireUser } from '~/infra/auth/require-user';
import { taskService } from '~/infra/tasks/task.repository';

export async function loader({ request }: Route.LoaderArgs): Promise<HomePageProps> {
  const user = await requireUser(request);
  const tasks = await taskService.listByUser(user.id);

  const done = tasks.filter((t) => t.status === 'done').length;
  const open = tasks.length - done;

  return {
    env: {
      mode: process.env.NODE_ENV ?? 'development',
      dbProvider: process.env.DB_PROVIDER ?? 'sqlite',
    },
    stats: {
      total: tasks.length,
      open,
      done,
    },
    recentTasks: tasks.slice(0, 5).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
    })),
    user: {
      role: user.role,
    },
  };
}

export default function HomeRoute() {
  const data = useLoaderData<typeof loader>();
  return <HomePage {...data} />;
}
