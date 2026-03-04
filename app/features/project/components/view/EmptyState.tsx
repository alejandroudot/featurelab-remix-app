import { EmptyState as UiEmptyState } from '~/ui/states/EmptyState';

type TaskEmptyStateProps = {
  searchTerm: string;
  activeProjectId: string | null;
  projectScopedTasksCount: number;
  visibleTasksCount: number;
};

export function EmptyState({
  searchTerm,
  activeProjectId,
  projectScopedTasksCount,
  visibleTasksCount,
}: TaskEmptyStateProps) {
  if (searchTerm.trim()) {
    return <UiEmptyState title={`No hay resultados para "${searchTerm.trim()}".`} description="Proba con otra palabra clave." />;
  }

  if (activeProjectId && projectScopedTasksCount === 0) {
    return <UiEmptyState title="No hay tareas en este proyecto todavia." description="Crea una tarea para empezar." />;
  }

  if (visibleTasksCount === 0) {
    return <UiEmptyState title="Aun no hay tareas." description="Crea tu primera tarea para empezar." />;
  }

  return null;
}
