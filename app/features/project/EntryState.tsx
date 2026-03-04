import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { ProjectsList } from './ProjectsList';
import { EmptyState } from './components/empty/EmptyState';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import type { Project } from '~/core/project/project.types';

export function EntryState({
  initialProjects,
  initialActiveProjectId,
  onOpenCreateProject,
  onOpenDeleteProject,
}: {
  initialProjects: Project[];
  initialActiveProjectId: string | null;
  onOpenCreateProject: () => void;
  onOpenDeleteProject: (projectId: string) => void;
}) {
  const dataStore = useWorkspaceDataStore(
    useShallow((state) => ({
      currentUserId: state.currentUserId,
      projects: state.projects,
    })),
  );
  const { activeProjectId } = useWorkspaceUiStore(
    useShallow((state) => ({
      activeProjectId: state.activeProjectId,
    })),
  );
  const projects = dataStore.currentUserId.length > 0 ? dataStore.projects : initialProjects;
  const resolvedProjectId = activeProjectId ?? initialActiveProjectId;
  const hasProjects = projects.length > 0;

  if (!hasProjects) {
    return (
      <main className="container mx-auto space-y-4 p-4">
        <EmptyState
          title="Todavia no hay proyectos."
          description='Crea uno desde "Nuevo proyecto" para empezar.'
        />
        <button
          type="button"
          onClick={onOpenCreateProject}
          className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-accent"
        >
          <Plus className="size-4" />
          Nuevo proyecto
        </button>
      </main>
    );
  }

	if (!resolvedProjectId && hasProjects) {
    return (
      <ProjectsList
        projects={projects}
        onOpenCreateProject={onOpenCreateProject}
        onOpenDeleteProject={onOpenDeleteProject}
      />
    );
  }

  return null;
}
