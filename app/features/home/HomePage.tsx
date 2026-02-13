import { Form, Link } from 'react-router';
import type { HomePageProps } from './types';

export function HomePage({ env, stats, recentTasks, user }: HomePageProps) {
  return (
    <main className="container mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">FeatureLab</h1>
        <p className="text-base opacity-80 max-w-2xl">
          Un mini-workspace fullstack para gestionar <b>Tasks</b> y <b>Feature Flags</b> con
          arquitectura hexagonal (dominio/infra/UI) y persistencia real (SQLite - Supabase/Postgres).
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

          {user.role === 'admin' ? (
            <Link
              to="/flags"
              className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium"
            >
              Feature Flags
            </Link>
          ) : null}
        </div>
      </header>

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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ultimas tasks</h2>
          <Link to="/tasks" className="text-sm underline opacity-80">
            Ver todas
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="border rounded p-4 opacity-80">
            No hay tasks todavia. Crea la primera en{' '}
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
                  {t.status} - {t.priority}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Siguiente paso</h3>
        <p className="text-sm opacity-80">
          Implementar <b>Feature Flags</b> (create/list/toggle) replicando el patron fullstack que
          ya usamos en Tasks.
        </p>
      </section>

      <Form method="post" action="/auth/logout">
        <button type="submit">Logout</button>
      </Form>
    </main>
  );
}
