import { Search, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';

export function ToolbarSearch() {
  const { searchTerm, setSearchTerm } = useWorkspaceUiStore(
    useShallow((state) => ({
      searchTerm: state.searchTerm,
      setSearchTerm: state.setSearchTerm,
    })),
  );

  return (
    <div className="relative w-65 sm:w-70">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        placeholder="Buscar tareas"
        className="h-9 w-full rounded-md border bg-background pl-9 pr-9 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      {searchTerm ? (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Limpiar busqueda"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
