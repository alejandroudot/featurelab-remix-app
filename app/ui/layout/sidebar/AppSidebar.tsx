import { useMemo, useState } from 'react';
import { Flag, Users } from 'lucide-react';
import { Link, useLocation, useRevalidator } from 'react-router';
import { usePinProjectMutation, useReorderProjectSidebarMutation } from '~/features/project/client/mutation';
import { isSuccessfulMutation } from '~/lib/query/mutation-result';
import { ProjectsSection } from './ProjectsSection';
import type { AppSidebarProps } from './types';
import { buildTasksHref, navClassName, reorderIds, sortProjectsForSidebar } from './utils';

export function AppSidebar({ userRole, projects }: AppSidebarProps) {
  const location = useLocation();
  const revalidator = useRevalidator();
  const { mutateAsync: pinProject, isPending: isPinPending } = usePinProjectMutation();
  const { mutateAsync: reorderSidebar, isPending: isReorderPending } = useReorderProjectSidebarMutation();
  const isFlagsActive = location.pathname === '/flags';
  const showTeams = userRole === 'manager' || userRole === 'admin';
  const showFlags = userRole === 'admin';
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const activeProjectId = useMemo(() => new URLSearchParams(location.search).get('project'), [location.search]);
  const orderedProjects = useMemo(() => sortProjectsForSidebar(projects), [projects]);
  const pinnedProjects = orderedProjects.filter((project) => project.pinned);
  const otherProjects = orderedProjects.filter((project) => !project.pinned);
  const isBusy = isPinPending || isReorderPending;

  async function handleTogglePinned(projectId: string, pinned: boolean) {
    const result = await pinProject({ id: projectId, pinned: !pinned });
    if (!isSuccessfulMutation(result)) return;
    revalidator.revalidate();
  }

  async function handleDropProject(targetProjectId: string, groupProjectIds: string[]) {
    if (!draggedProjectId || draggedProjectId === targetProjectId) return;
    if (!groupProjectIds.includes(draggedProjectId)) return;
    const nextOrderedIds = reorderIds(groupProjectIds, draggedProjectId, targetProjectId);
    if (nextOrderedIds === groupProjectIds) return;
    const result = await reorderSidebar({ orderedProjectIds: nextOrderedIds });
    if (!isSuccessfulMutation(result)) return;
    revalidator.revalidate();
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
            <ProjectsSection
              projects={projects}
              pinnedProjects={pinnedProjects}
              otherProjects={otherProjects}
              activeProjectId={activeProjectId}
              isBusy={isBusy}
              buildProjectHref={(projectId) => buildTasksHref(location.search, projectId)}
              onDragStartProject={setDraggedProjectId}
              onDragEndProject={() => setDraggedProjectId(null)}
              onDropProject={(targetProjectId, groupProjects) =>
                void handleDropProject(targetProjectId, groupProjects.map((project) => project.id))
              }
              onTogglePinned={(project) => void handleTogglePinned(project.id, project.pinned)}
            />

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

