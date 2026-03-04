import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { ProjectsList } from './ProjectsList';
import { EmptyState } from './components/empty/EmptyState';
import { useProjectDialogStore } from '~/features/store/project-dialog.store';
import type { Project } from '~/core/project/project.types';

export function EntryState({
  projects,
  activeProjectId,
}: {
  projects: Project[];
  activeProjectId: string | null;
}) {
  const { openCreateProjectDialog } = useProjectDialogStore(
    useShallow((state) => ({
      openCreateProjectDialog: state.openCreateProjectDialog,
    })),
  );
  const hasProjects = projects.length > 0;
  const hasActiveProject = projects.some((project) => project.id === activeProjectId);

  if (!hasProjects) {
    return (
      <main className="container mx-auto space-y-4 p-4">
        <EmptyState
          title="Todavia no hay proyectos."
          description='Crea uno desde "Nuevo proyecto" para empezar.'
        />
        <button
          type="button"
          onClick={openCreateProjectDialog}
          className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-accent"
        >
          <Plus className="size-4" />
          Nuevo proyecto
        </button>
      </main>
    );
  }

  if (!hasActiveProject && hasProjects) {
    return <ProjectsList projects={projects} />;
  }

  return null;
}
