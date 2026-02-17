//doc :  Compone presenta la vista UI de la home

import { Form } from 'react-router';
import { HomeActivitySection } from './HomeActivitySection';
import { HomeQuickActions } from './HomeQuickActions';
import { HomeStatsSection } from './HomeStatsSection';
import type { HomePageProps } from './types';

export function HomePage({ env, stats, recentActivity, flagsSummary, user }: HomePageProps) {
  return (
    <main className="container mx-auto p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Execution Hub</h1>
            <p className="text-sm opacity-80 max-w-2xl">
              Centro operativo para revisar estado de tasks, actividad reciente y ejecutar acciones
              rapidas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="border rounded px-2 py-1">mode: {env.mode}</span>
          <span className="border rounded px-2 py-1">db: {env.dbProvider}</span>
          <span className="border rounded px-2 py-1">{user.role}</span>
        </div>
      </header>

      <HomeStatsSection stats={stats} />

      <section className="grid gap-4 lg:grid-cols-3">
        <HomeActivitySection recentActivity={recentActivity} />
        <HomeQuickActions flagsSummary={flagsSummary} userRole={user.role} />
      </section>

      <Form method="post" action="/auth/logout">
        <button type="submit" className="border rounded px-3 py-1 text-sm">
          Logout
        </button>
      </Form>
    </main>
  );
}
