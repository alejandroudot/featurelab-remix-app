// app/routes/home.tsx
import { Link, useLoaderData } from 'react-router';
import { Form } from "react-router";

import { taskService } from '../infra/tasks/task.repository';
import type { Route } from '../+types/root';
import { requireUser } from '~/infra/auth/require-user';

type HomeLoaderData = {
  env: {
    mode: string;
    dbProvider: string;
  };
  stats: {
    total: number;
    open: number;
    done: number;
  };
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
	user: {
		role: string;
	}
};

export async function loader({request}: Route.LoaderArgs): Promise<HomeLoaderData> {
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
			role: user.role
		}
  };
}

export default function Home() {
  const { env, stats, recentTasks, user } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto p-6 space-y-8">
      {/* Hero */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">FeatureLab</h1>
        <p className="text-base opacity-80 max-w-2xl">
          Un mini-workspace fullstack para gestionar <b>Tasks</b> y <b>Feature Flags</b> con
          arquitectura hexagonal (dominio/infra/UI) y persistencia real (SQLite →
          Supabase/Postgres).
        </p>

        <div className="flex flex-wrap gap-2 text-xs mt-3">
          <span className="border rounded px-2 py-1">mode: {env.mode}</span>
          <span className="border rounded px-2 py-1">db: {env.dbProvider}</span>
          <span className="border rounded px-2 py-1">React Router Fullstack</span>
          <span className="border rounded px-2 py-1">Drizzle ORM</span>
          <span className="border rounded px-2 py-1">Tailwind</span>
        </div>

        <div className="flex gap-3 pt-3">
          <Link
            to="/tasks"
            className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium"
          >
            Ir a Tasks
          </Link>
					{user.role === 'admin' && 
					<Link
            to="/flags"
            className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium"
          >
            Feature Flags
          </Link>
					}
          
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="border rounded p-4">
          <div className="text-xs opacity-70">Total tasks</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs opacity-70">Abiertas</div>
          <div className="text-2xl font-semibold">{stats.open}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs opacity-70">Completadas</div>
          <div className="text-2xl font-semibold">{stats.done}</div>
        </div>
      </section>

      {/* Recent */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimas tasks</h2>
          <Link to="/tasks" className="text-sm underline opacity-80">
            Ver todas
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="border rounded p-4 opacity-80">
            No hay tasks todavía. Creá la primera en{' '}
            <Link className="underline" to="/tasks">
              /tasks
            </Link>
            .
          </div>
        ) : (
          <ul className="space-y-2">
            {recentTasks.map((t) => (
              <li key={t.id} className="border rounded p-3">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs opacity-70 mt-1">
                  {t.status} · {t.priority}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Next */}
      <section className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Siguiente paso</h3>
        <p className="text-sm opacity-80">
          Implementar <b>Feature Flags</b> (create/list/toggle) replicando el patrón fullstack que
          ya usamos en Tasks.
        </p>
      </section>
      <Form method="post" action="/auth/logout">
        <button type="submit">Logout</button>
      </Form>
    </main>
  );
}
