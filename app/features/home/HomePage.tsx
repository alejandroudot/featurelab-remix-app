//doc :  Compone presenta la vista UI de la home

import { Form } from 'react-router';
import { HomeActivitySection } from './components/HomeActivitySection';
import { HomeQuickActions } from './components/HomeQuickActions';
import { HomeStatsSection } from './components/HomeStatsSection';
import type { HomePageProps } from './types';
import { Badge } from '~/ui/primitives/badge';
import { Button } from '~/ui/primitives/button';

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
          <Badge variant="outline">mode: {env.mode}</Badge>
          <Badge variant="outline">db: {env.dbProvider}</Badge>
          <Badge variant="outline">{user.role}</Badge>
        </div>
      </header>

      <HomeStatsSection stats={stats} />

      <section className="grid gap-4 lg:grid-cols-3">
        <HomeActivitySection recentActivity={recentActivity} />
        <HomeQuickActions flagsSummary={flagsSummary} userRole={user.role} />
      </section>

      <Form method="post" action="/auth/logout">
        <Button type="submit" variant="outline">
          Logout
        </Button>
      </Form>
    </main>
  );
}
