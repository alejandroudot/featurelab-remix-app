import { useShallow } from 'zustand/react/shallow';
import type { Project } from '~/core/project/project.types';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';

type ToolbarTitleProps = {
  initialProjects: Project[];
  initialActiveProjectId: string | null;
};

export function ToolbarTitle({ initialProjects, initialActiveProjectId }: ToolbarTitleProps) {
  const { currentUserId, projects } = useWorkspaceDataStore(
    useShallow((state) => ({
      currentUserId: state.currentUserId,
      projects: state.projects,
    })),
  );
  const activeProjectId = useWorkspaceUiStore((state) => state.activeProjectId);
  const hydratedProjects = currentUserId.length > 0 ? projects : initialProjects;
  const resolvedProjectId = activeProjectId ?? initialActiveProjectId;
  const activeProject = hydratedProjects.find((project) => project.id === resolvedProjectId) ?? null;
  const projectName = activeProject ? activeProject.name : hydratedProjects[0]?.name ?? 'Sin proyecto';

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">Projects / {projectName}</p>
      <h1 className="text-2xl font-semibold">{projectName}</h1>
    </div>
  );
}
