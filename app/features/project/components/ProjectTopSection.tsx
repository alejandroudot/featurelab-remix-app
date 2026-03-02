import { Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import type { ProjectViewState } from '~/features/task/types';
import { Button } from '~/ui/primitives/button';
import { OptionsDropdown } from '~/ui/menus/options-dropdown';

type ProjectTopSectionProps = {
  projectName: string;
  viewState: ProjectViewState;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onClearSearch: () => void;
  onOpenCreate: () => void;
  onViewChange: (value: string) => void;
  onOrderChange: (value: string) => void;
  onScopeChange: (value: string) => void;
  onDeleteProject?: () => void;
};

export function ProjectTopSection({
  projectName,
  viewState,
  searchTerm,
  onSearchTermChange,
  onClearSearch,
  onOpenCreate,
  onViewChange,
  onOrderChange,
  onScopeChange,
  onDeleteProject,
}: ProjectTopSectionProps) {
  return (
    <header className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Projects / {projectName}</p>
        <h1 className="text-2xl font-semibold">{projectName}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-65 sm:w-70">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.currentTarget.value)}
            placeholder="Buscar tareas"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-9 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Limpiar busqueda"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button type="button" className="shrink-0" onClick={onOpenCreate}>
            <Plus className="size-4" />
            Crear tarea
          </Button>

          <OptionsDropdown
            triggerLabel="View settings"
            triggerIcon={<SlidersHorizontal className="size-4" />}
            sections={[
              {
                label: 'View',
                value: viewState.view,
                onValueChange: onViewChange,
                options: [
                  { value: 'board', label: 'Board' },
                  { value: 'list', label: 'List' },
                ],
              },
              {
                label: 'Order',
                value: viewState.order,
                onValueChange: onOrderChange,
                options: [
                  { value: 'manual', label: 'Manual' },
                  { value: 'priority', label: 'Priority' },
                ],
              },
            ]}
          />

          <OptionsDropdown
            triggerLabel="Scope"
            contentClassName="w-48"
            sections={[
              {
                value: viewState.scope,
                onValueChange: onScopeChange,
                options: [
                  { value: 'all', label: 'All' },
                  { value: 'assigned', label: 'Assigned' },
                  { value: 'created', label: 'Created' },
                ],
              },
            ]}
          />

          {onDeleteProject ? (
            <button
              type="button"
              onClick={onDeleteProject}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-destructive transition hover:bg-destructive/10"
              aria-label="Eliminar proyecto"
              title="Eliminar proyecto"
            >
              <Trash2 className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
