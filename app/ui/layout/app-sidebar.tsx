import { FolderKanban, Flag, Layers3, Plus, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import type { UserRole } from '~/core/auth/auth.types';

type Props = {
  userRole: UserRole;
};

function navClassName(isActive: boolean) {
  return `flex items-center gap-2 rounded px-3 py-2 text-sm transition ${
    isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'hover:bg-muted'
  }`;
}

export function AppSidebar({ userRole }: Props) {
  const location = useLocation();
  const isTasksActive = location.pathname === '/' || location.pathname === '/tasks';
  const isFlagsActive = location.pathname === '/flags';
  const showTeams = userRole === 'manager' || userRole === 'admin';
  const showFlags = userRole === 'admin';

  return (
    <aside className="hidden h-full border-r bg-muted/20 md:block">
      <div className="flex h-full flex-col overflow-y-auto p-3">
        <nav className="space-y-2">
          <div className="rounded border bg-background p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Home</p>
            <p className="text-sm font-medium">Workspace</p>
          </div>

          <div className="space-y-2 rounded border bg-background p-2">
            <Link to="/" className={navClassName(isTasksActive)}>
              <Layers3 className="size-4" />
              <span>Tasks</span>
            </Link>

            <section className="rounded border bg-background p-3">
              <header className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <FolderKanban className="size-4" />
                  Projects
                </p>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs opacity-60"
                  aria-label="Crear proyecto (proximamente)"
                >
                  <Plus className="size-3" />
                  Nuevo
                </button>
              </header>
              <p className="text-xs text-muted-foreground">Crea tu primer proyecto para empezar.</p>
            </section>

            {showTeams ? (
              <section className="rounded border bg-background p-3">
                <header className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Users className="size-4" />
                  Teams
                </header>
                <p className="text-xs text-muted-foreground">Panel base listo para Team Manager.</p>
              </section>
            ) : null}

            {showFlags ? (
              <Link to="/flags" className={navClassName(isFlagsActive)}>
                <Flag className="size-4" />
                <span>Flags</span>
              </Link>
            ) : null}
          </div>
        </nav>

      </div>
    </aside>
  );
}
