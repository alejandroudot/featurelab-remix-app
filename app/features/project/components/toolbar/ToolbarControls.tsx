import { useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Button } from '~/ui/primitives/button';
import { OptionsDropdown } from '~/ui/menus/options-dropdown';
import { useWorkspaceDataStore } from '~/features/project/store/data.store';
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';
import { persistProjectViewPreferences } from '~/features/project/utils/preferences';
import type { ProjectViewState } from '~/features/task/types';

export function ToolbarControls({
  initialViewState,
  initialActiveProjectId,
  onOpenDeleteProject,
}: {
  initialViewState: ProjectViewState;
  initialActiveProjectId: string | null;
  onOpenDeleteProject: (projectId: string) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUserId = useWorkspaceDataStore((state) => state.currentUserId);
  const { activeProjectId, view, order, scope } = useWorkspaceUiStore(
    useShallow((state) => ({
      activeProjectId: state.activeProjectId,
      view: state.view,
      order: state.order,
      scope: state.scope,
    })),
  );
  const { setCreateTaskOpen, setView, setOrder, setScope } = useWorkspaceUiStore(
    useShallow((state) => ({
      setCreateTaskOpen: state.setCreateTaskOpen,
      setView: state.setView,
      setOrder: state.setOrder,
      setScope: state.setScope,
    })),
  );
  const isHydrated = currentUserId.length > 0;
  const resolvedView = isHydrated ? view : initialViewState.view;
  const resolvedOrder = isHydrated ? order : initialViewState.order;
  const resolvedScope = isHydrated ? scope : initialViewState.scope;
  const resolvedActiveProjectId = activeProjectId ?? initialActiveProjectId;

  function updateViewParam(key: 'view' | 'order' | 'scope', value: string) {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next);
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      <Button type="button" className="shrink-0" onClick={() => setCreateTaskOpen(true)}>
        <Plus className="size-4" />
        Crear tarea
      </Button>

      <OptionsDropdown
        triggerLabel="View settings"
        triggerIcon={<SlidersHorizontal className="size-4" />}
        sections={[
          {
            label: 'View',
            value: resolvedView,
            onValueChange: (value) => {
              if (value === 'board' || value === 'list') {
                setView(value);
                updateViewParam('view', value);
                persistProjectViewPreferences({ view: value, order: resolvedOrder, scope: resolvedScope });
              }
            },
            options: [
              { value: 'board', label: 'Board' },
              { value: 'list', label: 'List' },
            ],
          },
          {
            label: 'Order',
            value: resolvedOrder,
            onValueChange: (value) => {
              if (value === 'manual' || value === 'priority') {
                setOrder(value);
                updateViewParam('order', value);
                persistProjectViewPreferences({ view: resolvedView, order: value, scope: resolvedScope });
              }
            },
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
            value: resolvedScope,
            onValueChange: (value) => {
              if (value === 'all' || value === 'assigned' || value === 'created') {
                setScope(value);
                updateViewParam('scope', value);
                persistProjectViewPreferences({ view: resolvedView, order: resolvedOrder, scope: value });
              }
            },
            options: [
              { value: 'all', label: 'All' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'created', label: 'Created' },
            ],
          },
        ]}
      />

      {resolvedActiveProjectId ? (
        <button
          type="button"
          onClick={() => onOpenDeleteProject(resolvedActiveProjectId)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-destructive transition hover:bg-destructive/10"
          aria-label="Eliminar proyecto"
          title="Eliminar proyecto"
        >
          <Trash2 className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
