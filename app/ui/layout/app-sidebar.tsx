import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, FolderKanban, Flag, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import type { UserRole } from '~/core/auth/auth.types';
import type { Project } from '~/core/project/project.types';
import {
  PROJECTS_UPDATED_EVENT,
  localProjectStoragePort,
} from '~/infra/project/project.storage.local';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const isFlagsActive = location.pathname === '/flags';
  const showTeams = userRole === 'manager' || userRole === 'admin';
  const showFlags = userRole === 'admin';
  const activeProjectId = useMemo(
    () => new URLSearchParams(location.search).get('project'),
    [location.search],
  );
  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => a.createdAt - b.createdAt),
    [projects],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function syncProjectsFromStorage() {
      setProjects(localProjectStoragePort.readAll());
    }

    syncProjectsFromStorage();
    window.addEventListener('storage', syncProjectsFromStorage);
    window.addEventListener(PROJECTS_UPDATED_EVENT, syncProjectsFromStorage);
    return () => {
      window.removeEventListener('storage', syncProjectsFromStorage);
      window.removeEventListener(PROJECTS_UPDATED_EVENT, syncProjectsFromStorage);
    };
  }, [location.search]);

  function buildTasksHref(projectId: string) {
    const next = new URLSearchParams(location.search);
    next.set('project', projectId);
    const query = next.toString();
    return query ? `/?${query}` : '/';
  }

  return (
    <aside className="hidden h-full border-r bg-muted/20 md:block">
      <div className="flex h-full flex-col overflow-y-auto p-3">
        <nav className="space-y-2">
          <div className="rounded-xl border bg-background/90 p-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Home</p>
            <p className="text-sm font-medium">Workspace</p>
          </div>

          <div className="space-y-2 rounded-xl border bg-background/90 p-2 shadow-sm">
            <section className="rounded-lg border bg-background p-2.5">
              <header className="mb-2 flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-accent"
                >
                  <ChevronDown className="size-4" />
                  <FolderKanban className="size-4" />
                  Projects
                </Link>
              </header>
              <div className="space-y-2">
                {projects.length === 0 ? (
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    Crea tu primer proyecto para empezar.
                  </p>
                ) : (
                  <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
                    {orderedProjects.map((project) => {
                      const isActive = project.id === activeProjectId;
                      return (
                        <Link
                          key={project.id}
                          to={buildTasksHref(project.id)}
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition ${
                            isActive ? 'bg-accent font-medium shadow-sm' : 'hover:bg-accent/50'
                          }`}
                        >
                          <span
                            className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-muted"
                            aria-hidden="true"
                          >
                            {project.imageUrl ? (
                              <img
                                src={project.imageUrl}
                                alt=""
                                className="size-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {project.name.trim().charAt(0).toUpperCase() || 'P'}
                              </span>
                            )}
                          </span>
                          <span className="truncate">{project.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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

