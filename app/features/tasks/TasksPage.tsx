import type { TaskActionData } from './types';
import { CreateTaskForm } from './CreateTaskForm';
import { TasksList } from './TasksList';
import type { FlagResolution } from '~/core/flags/flags.service';
import type { Task } from '~/core/tasks/tasks.types';

export function TasksPage({
  tasks,
  actionData,
  isSubmitting,
  betaTasksUI,
  betaTasksUIResolution,
}: {
  tasks: Task[];
  actionData: TaskActionData;
  isSubmitting: boolean;
  betaTasksUI: boolean;
  betaTasksUIResolution?: FlagResolution;
}) {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="opacity-80 text-sm">Aqui puedes crear tus tareas y acomodarlas.</p>
      </header>

      {betaTasksUI ? (
        <div className="border rounded p-3 text-sm">
          <div className="font-medium">Beta Tasks UI activa</div>
          <div className="opacity-80">Aca despues metemos mejoras (filtros, vista kanban, etc.)</div>
        </div>
      ) : null}

      {betaTasksUIResolution ? (
        <div className="border rounded p-3 text-xs opacity-85">
          <div className="font-medium">Flag debug: beta-tasks-ui</div>
          <div>enabled: {String(betaTasksUIResolution.enabled)}</div>
          <div>reason: {betaTasksUIResolution.reason}</div>
          {typeof betaTasksUIResolution.bucket === 'number' ? (
            <div>bucket: {betaTasksUIResolution.bucket}</div>
          ) : null}
          {typeof betaTasksUIResolution.rolloutPercent === 'number' ? (
            <div>rolloutPercent: {betaTasksUIResolution.rolloutPercent}</div>
          ) : null}
        </div>
      ) : null}

      <CreateTaskForm actionData={actionData} isSubmitting={isSubmitting} />
      <TasksList tasks={tasks} />
    </main>
  );
}
