import { useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Button } from '~/ui/primitives/button';
import { OptionsDropdown } from '~/ui/menus/options-dropdown';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { useProjectDialogStore } from '~/features/store/project-dialog.store';
import { persistProjectViewPreferences } from '~/features/project/utils/preferences';

export function ToolbarControls() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openProjectDeleteDialog } = useProjectDialogStore(
    useShallow((state) => ({
      openProjectDeleteDialog: state.openProjectDeleteDialog,
    })),
  );
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
            value: view,
            onValueChange: (value) => {
              if (value === 'board' || value === 'list') {
                setView(value);
                updateViewParam('view', value);
                persistProjectViewPreferences({ view: value, order, scope });
              }
            },
            options: [
              { value: 'board', label: 'Board' },
              { value: 'list', label: 'List' },
            ],
          },
          {
            label: 'Order',
            value: order,
            onValueChange: (value) => {
              if (value === 'manual' || value === 'priority') {
                setOrder(value);
                updateViewParam('order', value);
                persistProjectViewPreferences({ view, order: value, scope });
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
            value: scope,
            onValueChange: (value) => {
              if (value === 'all' || value === 'assigned' || value === 'created') {
                setScope(value);
                updateViewParam('scope', value);
                persistProjectViewPreferences({ view, order, scope: value });
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

      {activeProjectId ? (
        <button
          type="button"
          onClick={() => openProjectDeleteDialog(activeProjectId)}
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
