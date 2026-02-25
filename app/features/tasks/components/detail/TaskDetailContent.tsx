import type { Task } from '~/core/tasks/tasks.types';

type TaskDetailContentProps = {
  task: Task;
};

export function TaskDetailContent({ task }: TaskDetailContentProps) {
  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
      <p className="text-sm opacity-85">{task.description || 'Sin descripcion por ahora.'}</p>
    </div>
  );
}
