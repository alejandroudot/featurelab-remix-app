import { Link } from 'react-router';
import type { HomePageProps } from './types';
import { HomeFeatureSwitches } from './HomeFeatureSwitches';

type HomeQuickActionsProps = {
  userRole: HomePageProps['user']['role'];
  flagsSummary: HomePageProps['flagsSummary'];
};

export function HomeQuickActions({ userRole, flagsSummary }: HomeQuickActionsProps) {
  return (
    <aside className="border rounded p-4 space-y-3">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="flex flex-col gap-2">
        <Link to="/tasks#create-task" className="rounded border px-3 py-2 text-sm">
          Crear task
        </Link>
        <Link to="/tasks" className="rounded border px-3 py-2 text-sm">
          Ir al board/listado de tasks
        </Link>
        {userRole === 'admin' ? (
          <Link to="/flags" className="rounded border px-3 py-2 text-sm">
            Gestionar feature flags
          </Link>
        ) : null}
      </div>

      <div className="pt-2 border-t">
        <p className="text-xs opacity-70">
          Proxima iteracion: dark mode toggle y panel inline de feature switches para admins.
        </p>
      </div>

      <HomeFeatureSwitches flagsSummary={flagsSummary} userRole={userRole} />
    </aside>
  );
}
