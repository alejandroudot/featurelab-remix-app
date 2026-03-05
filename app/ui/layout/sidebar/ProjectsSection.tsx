import { ChevronDown, FolderKanban } from 'lucide-react';
import { Link } from 'react-router';
import type { Project } from '~/core/project/project.types';
import { ProjectRow } from './ProjectRow';

type ProjectsSectionProps = {
  projects: Project[];
  pinnedProjects: Project[];
  otherProjects: Project[];
  activeProjectId: string | null;
  isBusy: boolean;
  buildProjectHref: (projectId: string) => string;
  onDragStartProject: (projectId: string) => void;
  onDragEndProject: () => void;
  onDropProject: (targetProjectId: string, groupProjects: Project[]) => void;
  onTogglePinned: (project: Project) => void;
};

export function ProjectsSection({
  projects,
  pinnedProjects,
  otherProjects,
  activeProjectId,
  isBusy,
  buildProjectHref,
  onDragStartProject,
  onDragEndProject,
  onDropProject,
  onTogglePinned,
}: ProjectsSectionProps) {
  return (
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
          <p className="px-2 py-1 text-xs text-muted-foreground">Crea tu primer proyecto para empezar.</p>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {pinnedProjects.length > 0 ? (
              <div className="space-y-1">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pinned</p>
                {pinnedProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    isActive={project.id === activeProjectId}
                    isBusy={isBusy}
                    href={buildProjectHref(project.id)}
                    onDragStart={() => onDragStartProject(project.id)}
                    onDragEnd={onDragEndProject}
                    onDrop={() => onDropProject(project.id, pinnedProjects)}
                    onTogglePinned={() => onTogglePinned(project)}
                  />
                ))}
              </div>
            ) : null}
            <div className="space-y-1">
              {pinnedProjects.length > 0 ? (
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Projects</p>
              ) : null}
              {otherProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isActive={project.id === activeProjectId}
                  isBusy={isBusy}
                  href={buildProjectHref(project.id)}
                  onDragStart={() => onDragStartProject(project.id)}
                  onDragEnd={onDragEndProject}
                  onDrop={() => onDropProject(project.id, otherProjects)}
                  onTogglePinned={() => onTogglePinned(project)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

