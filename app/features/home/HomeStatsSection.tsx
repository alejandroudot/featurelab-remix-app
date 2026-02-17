import type { HomePageProps } from './types';

type HomeStatsSectionProps = {
  stats: HomePageProps['stats'];
};

export function HomeStatsSection({ stats }: HomeStatsSectionProps) {
  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="border rounded p-4">
          <div className="text-xs opacity-70">Total tasks</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs opacity-70">In progress / abiertas</div>
          <div className="text-2xl font-semibold">{stats.open}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs opacity-70">Done / completadas</div>
          <div className="text-2xl font-semibold">{stats.done}</div>
        </div>
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="text-lg font-semibold">Status breakdown</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded border p-3">
            <div className="text-xs opacity-70">To Do</div>
            <div className="text-xl font-semibold">{stats.byStatus.todo}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-xs opacity-70">In Progress</div>
            <div className="text-xl font-semibold">{stats.byStatus.inProgress}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-xs opacity-70">QA</div>
            <div className="text-xl font-semibold">{stats.byStatus.qa}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-xs opacity-70">Ready to Go Live</div>
            <div className="text-xl font-semibold">{stats.byStatus.readyToGoLive}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-xs opacity-70">Done</div>
            <div className="text-xl font-semibold">{stats.byStatus.done}</div>
          </div>
        </div>
      </section>
    </>
  );
}
