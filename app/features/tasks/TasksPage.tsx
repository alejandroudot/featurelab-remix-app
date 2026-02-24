import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams, useSubmit } from 'react-router';
import type { TaskActionData } from './types';
import { CreateTaskForm } from './components/page/CreateTaskForm';
import { TasksList } from './components/page/TasksList';
import { TasksViewControls } from './components/page/TasksViewControls';
import { TasksEmptyState } from './components/page/TasksEmptyState';
import { TasksBoardView } from './components/board/TasksBoardView';
import { TaskDetailModal } from './components/detail/TaskDetailModal';
import type { Task, TaskStatus } from '~/core/tasks/tasks.types';
import type { TasksViewState } from './server/task-view-state';
import type { TaskAssigneeOption } from './types';
import { toast } from 'sonner';
import { getTaskActionToastError } from './client-errors';

export function TasksPage({
  currentUserId,
  tasks,
  assignableUsers,
  viewState,
  actionData,
  isSubmitting,
  betaTasksUI,
}: {
  currentUserId: string;
  tasks: Task[];
  assignableUsers: TaskAssigneeOption[];
  viewState: TasksViewState;
  actionData: TaskActionData;
  isSubmitting: boolean;
  betaTasksUI: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const submit = useSubmit();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  function setView(view: 'list' | 'board') {
    const next = new URLSearchParams(searchParams);
    next.set('view', view);
    setSearchParams(next);
  }

  function setOrder(order: 'manual' | 'priority') {
    const next = new URLSearchParams(searchParams);
    next.set('order', order);
    setSearchParams(next);
  }

  function setScope(scope: 'all' | 'assigned' | 'created') {
    const next = new URLSearchParams(searchParams);
    next.set('scope', scope);
    setSearchParams(next);
  }

  function resetViewConfig() {
    const next = new URLSearchParams(searchParams);
    next.set('view', 'board');
    next.set('order', 'manual');
    next.set('scope', 'all');
    setSearchParams(next);
  }

  function handleOpenTask(taskId: string) {
    setSelectedTaskId(taskId);
    setIsDetailOpen(true);
  }

  function handleEditTask(taskId: string) {
    handleOpenTask(taskId);
  }

  function handleDeleteTask(taskId: string) {
    submit(
      {
        intent: 'delete',
        id: taskId,
        redirectTo: `${location.pathname}${location.search}`,
      },
      {
        method: 'post',
      },
    );
  }

  function handleMoveTaskStatus(taskId: string, toStatus: TaskStatus, orderIndex?: number) {
    submit(
      {
        intent: 'update',
        id: taskId,
        status: toStatus,
        ...(orderIndex !== undefined ? { orderIndex: String(orderIndex) } : {}),
        redirectTo: `${location.pathname}${location.search}`,
      },
      {
        method: 'post',
        action: '/tasks',
      },
    );
  }

  function handleReorderColumn(
    status: Extract<TaskStatus, 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live'>,
    orderedTaskIds: string[],
  ) {
    submit(
      {
        intent: 'reorder-column',
        status,
        orderedTaskIds: JSON.stringify(orderedTaskIds),
        redirectTo: `${location.pathname}${location.search}`,
      },
      {
        method: 'post',
        action: '/tasks',
      },
    );
  }

  const hasNonDefaultViewState =
    viewState.view !== 'board' || viewState.order !== 'manual' || viewState.scope !== 'all';

  const visibleTasks = useMemo(() => {
    if (viewState.scope === 'assigned') {
      return tasks.filter((task) => task.assigneeId === currentUserId);
    }
    if (viewState.scope === 'created') {
      return tasks.filter((task) => task.userId === currentUserId);
    }
    return tasks;
  }, [tasks, currentUserId, viewState.scope]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );
	
  const assigneeById = useMemo(
    () =>
      Object.fromEntries(assignableUsers.map((user) => [user.id, user.email])) as Record<string, string>,
    [assignableUsers],
  );

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

        <TasksViewControls
          viewState={viewState}
          onSetView={setView}
          onSetOrder={setOrder}
          onSetScope={setScope}
        />
      </header>

      {betaTasksUI ? (
        <div className="rounded border p-3 text-sm">
          <div className="font-medium">Beta Tasks UI activa</div>
          <div className="opacity-80">
            Aca despues metemos mejoras (filtros, vista kanban, etc.)
          </div>
        </div>
      ) : null}

      <CreateTaskForm actionData={actionData} isSubmitting={isSubmitting} />

      {visibleTasks.length === 0 ? (
        <TasksEmptyState
          hasNonDefaultViewState={hasNonDefaultViewState}
          onResetViewConfig={resetViewConfig}
        />
      ) : viewState.view === 'list' ? (
        <TasksList tasks={visibleTasks} assigneeById={assigneeById} />
      ) : (
        <TasksBoardView
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

      <TaskDetailModal
        task={selectedTask}
        assignableUsers={assignableUsers}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </main>
  );
}
