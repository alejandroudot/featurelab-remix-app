import { useSearchParams, useSubmit } from 'react-router';
import type { TaskActionData } from './types';
import { CreateTaskForm } from './components/CreateTaskForm';
import { TasksList } from './components/TasksList';
import { TasksViewControls } from './components/TasksViewControls';
import { TasksEmptyState } from './components/TasksEmptyState';
import { TasksBoardView } from './components/TasksBoardView';
import type { Task } from '~/core/tasks/tasks.types';
import type { TasksViewState } from './server/task-view-state';

export function TasksPage({
  tasks,
  viewState,
  actionData,
  isSubmitting,
  betaTasksUI,
}: {
  tasks: Task[];
  viewState: TasksViewState;
  actionData: TaskActionData;
  isSubmitting: boolean;
  betaTasksUI: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

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

  function handleEditTask(_taskId: string) {
    setView('list');
  }

  function handleDeleteTask(taskId: string) {
    if (!confirm('Eliminar esta task?')) return;

    submit(
      {
        intent: 'delete',
        id: taskId,
      },
      {
        method: 'post',
      },
    );
  }

  const hasNonDefaultViewState = viewState.view !== 'board' || viewState.order !== 'manual';

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
        <TasksList tasks={tasks} />
      ) : (
        <TasksBoardView
          tasks={tasks}
          order={viewState.order}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </main>
  );
}
