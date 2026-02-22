type TasksEmptyStateProps = {
  hasNonDefaultViewState: boolean;
  onResetViewConfig: () => void;
};

export function TasksEmptyState({ hasNonDefaultViewState, onResetViewConfig }: TasksEmptyStateProps) {
  return (
    <section className="space-y-2 rounded border border-dashed p-4">
      <h2 className="text-lg font-semibold">Aun no hay tareas</h2>
      <p className="text-sm opacity-80">Crea tu primera task para empezar a planificar el trabajo.</p>
      <div className="flex flex-wrap gap-2">
        <a href="#create-task" className="rounded border px-3 py-1 text-xs font-medium">
          Crear task
        </a>
        {hasNonDefaultViewState ? (
          <button
            type="button"
            onClick={onResetViewConfig}
            className="rounded border px-3 py-1 text-xs font-medium"
          >
            Limpiar configuracion de vista
          </button>
        ) : null}
      </div>
    </section>
  );
}
