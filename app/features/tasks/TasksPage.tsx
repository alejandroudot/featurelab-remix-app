import { useMemo, useState } from 'react';
import { useLocation, useSearchParams, useSubmit } from 'react-router';
import type { TaskActionData } from './types';
import { CreateTaskForm } from './components/CreateTaskForm';
import { TasksList } from './components/TasksList';
import { TasksViewControls } from './components/TasksViewControls';
import { TasksEmptyState } from './components/TasksEmptyState';
import { TasksBoardView } from './components/TasksBoardView';
import { TaskDetailModal } from './components/TaskDetailModal';
import type { Task } from '~/core/tasks/tasks.types';
import type { TasksViewState } from './server/task-view-state';
import type { TaskAssigneeOption } from './types';

export function TasksPage({
  tasks,
  assignableUsers,
  viewState,
  actionData,
  isSubmitting,
  betaTasksUI,
}: {
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

  function resetViewConfig() {
    const next = new URLSearchParams(searchParams);
    next.set('view', 'board');
    next.set('order', 'manual');
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

  const hasNonDefaultViewState = viewState.view !== 'board' || viewState.order !== 'manual';
	
  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );
  const assigneeById = useMemo(
    () =>
      Object.fromEntries(assignableUsers.map((user) => [user.id, user.email])) as Record<string, string>,
    [assignableUsers],
  );

  return (
    <main className="container mx-auto space-y-6 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm opacity-80">Aqui puedes crear tus tareas y acomodarlas.</p>
        <p className="text-xs opacity-70">
          View: <span className="font-medium">{viewState.view}</span> - Order:{' '}
          <span className="font-medium">{viewState.order}</span>
        </p>

        <TasksViewControls viewState={viewState} onSetView={setView} onSetOrder={setOrder} />
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

      {tasks.length === 0 ? (
        <TasksEmptyState
          hasNonDefaultViewState={hasNonDefaultViewState}
          onResetViewConfig={resetViewConfig}
        />
      ) : viewState.view === 'list' ? (
        <TasksList tasks={tasks} assigneeById={assigneeById} />
      ) : (
        <TasksBoardView
          tasks={tasks}
          order={viewState.order}
          assigneeById={assigneeById}
          onOpenTask={handleOpenTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
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
