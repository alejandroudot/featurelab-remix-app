import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { useProjectDialogStore } from '~/features/store/project-dialog.store';
import type { Project } from '~/core/project/project.types';
import { EmptyState } from '~/ui/states/EmptyState';

export function ProjectsOverview({ projects }: { projects: Project[] }) {
  const { openCreateProjectDialog, openProjectDeleteDialog } = useProjectDialogStore(
    useShallow((state) => ({
      openCreateProjectDialog: state.openCreateProjectDialog,
      openProjectDeleteDialog: state.openProjectDeleteDialog,
    })),
  );

  if (projects.length === 0) {
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

  return (
    <main className="container mx-auto space-y-4 p-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Projects</p>
          <h1 className="text-2xl font-semibold">Todos los proyectos</h1>
        </div>
        <button
          type="button"
          onClick={openCreateProjectDialog}
          className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-accent"
        >
          <Plus className="size-4" />
          Nuevo proyecto
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="relative rounded-lg border bg-background">
            <Link
              to={`/?project=${project.id}`}
              className="block rounded-md p-3 pr-11 transition hover:bg-accent/30"
            >
              <div className="mb-2 inline-flex size-10 items-center justify-center overflow-hidden rounded-md border bg-muted">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt="" className="size-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">
                    {project.name.trim().charAt(0).toUpperCase() || 'P'}
                  </span>
                )}
              </div>
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">Abrir proyecto</p>
            </Link>
            <button
              type="button"
              onClick={() => openProjectDeleteDialog(project.id)}
              className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border text-destructive transition hover:bg-destructive/10"
              aria-label={`Eliminar proyecto ${project.name}`}
              title="Eliminar proyecto"
            >
              <Trash2 className="size-3" />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
