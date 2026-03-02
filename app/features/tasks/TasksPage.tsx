import { useEffect, useMemo, useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import type { TaskActionData } from './types';
import { CreateTask } from './components/create/CreateTask';
import { List } from './components/list/List';
import { EmptyState } from './components/EmptyState';
import { BoardView } from './components/board/View';
import { Modal } from './components/detail/Modal';
import type { Task, TaskActivity, TaskComment } from '~/core/tasks/tasks.types';
import type { TasksFiltersState } from './types';
import type { TaskAssigneeOption } from './types';
import { toast } from 'sonner';
import { getTaskActionToastError } from './utils/client-errors';
import { useTasksPageController } from './hooks/useTasksPageController';
import { buildAssigneeById, buildMentionCandidates, getVisibleTasks } from './utils/task-page-utils';
import { Button } from '~/ui/primitives/button';
import { ContentDialog } from '~/ui/dialogs/ContentDialog';
import { OptionsDropdown } from '~/ui/menus/options-dropdown';
import { persistTasksViewPreferences } from './utils/view-preferences';

export function TasksPage({
  currentUserId,
  tasks,
  taskActivities,
  taskComments,
  assignableUsers,
  viewState,
  actionData,
  isSubmitting,
}: {
  currentUserId: string;
  tasks: Task[];
  taskActivities: TaskActivity[];
  taskComments: TaskComment[];
  assignableUsers: TaskAssigneeOption[];
  viewState: TasksFiltersState;
  actionData: TaskActionData;
  isSubmitting: boolean;
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    setView,
    setOrder,
    setScope,
    resetViewConfig,
    handleDetailOpenChange,
    handleOpenTask,
    handleEditTask,
    handleDeleteTask,
    handleMoveTaskStatus,
    handleReorderColumn,
    selectedTaskId,
    isDetailOpen,
  } = useTasksPageController();

  const hasNonDefaultViewState =
    viewState.view !== 'board' || viewState.order !== 'manual' || viewState.scope !== 'all';

  const visibleTasks = useMemo(
    () =>
      getVisibleTasks({
        tasks,
        currentUserId,
        scope: viewState.scope,
        order: viewState.order,
      }),
    [tasks, currentUserId, viewState.scope, viewState.order],
  );

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );
  const selectedTaskActivities = useMemo(
    () =>
      selectedTaskId
        ? taskActivities.filter((activity) => activity.taskId === selectedTaskId)
        : [],
    [taskActivities, selectedTaskId],
  );
  const selectedTaskComments = useMemo(
    () => (selectedTaskId ? taskComments.filter((comment) => comment.taskId === selectedTaskId) : []),
    [taskComments, selectedTaskId],
  );
  const assigneeById = useMemo(() => buildAssigneeById(assignableUsers), [assignableUsers]);
  const mentionCandidates = useMemo(() => buildMentionCandidates(assignableUsers), [assignableUsers]);

  useEffect(() => {
    const message = getTaskActionToastError(actionData);
    if (message) toast.error(message);
  }, [actionData]);

  useEffect(() => {
    if (!actionData) {
      setIsCreateOpen(false);
      return;
    }

    if (actionData.success === false && actionData.intent === 'create') {
      setIsCreateOpen(true);
    }
  }, [actionData]);

  function handleViewChange(value: string) {
    if (value === 'board' || value === 'list') {
      setView(value);
      persistTasksViewPreferences({
        view: value,
        order: viewState.order,
        scope: viewState.scope,
      });
    }
  }

  function handleOrderChange(value: string) {
    if (value === 'manual' || value === 'priority') {
      setOrder(value);
      persistTasksViewPreferences({
        view: viewState.view,
        order: value,
        scope: viewState.scope,
      });
    }
  }

  function handleScopeChange(value: string) {
    if (value === 'all' || value === 'assigned' || value === 'created') {
      setScope(value);
      persistTasksViewPreferences({
        view: viewState.view,
        order: viewState.order,
        scope: value,
      });
    }
  }

  return (
    <main className="container mx-auto space-y-6 p-4">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">Tasks</h1>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" className="shrink-0" onClick={() => setIsCreateOpen(true)}>
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
                  onValueChange: handleViewChange,
                  options: [
                    { value: 'board', label: 'Board' },
                    { value: 'list', label: 'List' },
                  ],
                },
                {
                  label: 'Order',
                  value: viewState.order,
                  onValueChange: handleOrderChange,
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
                  onValueChange: handleScopeChange,
                  options: [
                    { value: 'all', label: 'All' },
                    { value: 'assigned', label: 'Assigned' },
                    { value: 'created', label: 'Created' },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </header>

      <ContentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Nueva tarea"
        description="Crea una task sin perder contexto del board."
        contentClassName="max-h-[90vh] sm:max-w-3xl"
      >
        <CreateTask
          actionData={actionData}
          isSubmitting={isSubmitting}
          mentionCandidates={mentionCandidates}
          className="space-y-3"
        />
      </ContentDialog>

      {visibleTasks.length === 0 ? (
        <EmptyState
          hasNonDefaultViewState={hasNonDefaultViewState}
          onResetViewConfig={resetViewConfig}
        />
      ) : viewState.view === 'list' ? (
        <List
          tasks={visibleTasks}
          assigneeById={assigneeById}
          onOpenTask={handleOpenTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <BoardView
          tasks={visibleTasks}
          order={viewState.order}
          assigneeById={assigneeById}
          onOpenTask={handleOpenTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTaskStatus={handleMoveTaskStatus}
          onReorderColumn={handleReorderColumn}
        />
      )}

      {selectedTask ? (
        <Modal
          task={selectedTask}
          currentUserId={currentUserId}
          activities={selectedTaskActivities}
          comments={selectedTaskComments}
          assignableUsers={assignableUsers}
          open={isDetailOpen}
          onDeleteTask={handleDeleteTask}
          onOpenChange={handleDetailOpenChange}
        />
      ) : null}
    </main>
  );
}
