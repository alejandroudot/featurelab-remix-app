import { useEffect, useMemo } from 'react';
import type { TaskActionData } from './types';
import { CreateTask } from './components/create/CreateTask';
import { List } from './components/list/List';
import { Filters } from './components/Filters';
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

  return (
    <main className="container mx-auto space-y-6 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm opacity-80">Aqui puedes crear tus tareas y acomodarlas.</p>
        <p className="text-xs opacity-70">
          View: <span className="font-medium">{viewState.view}</span> - Order:{' '}
          <span className="font-medium">{viewState.order}</span> - Scope:{' '}
          <span className="font-medium">{viewState.scope}</span>
        </p>

        <Filters
          viewState={viewState}
          onSetView={setView}
          onSetOrder={setOrder}
          onSetScope={setScope}
        />
      </header>

      <CreateTask
        actionData={actionData}
        isSubmitting={isSubmitting}
        mentionCandidates={mentionCandidates}
      />

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


