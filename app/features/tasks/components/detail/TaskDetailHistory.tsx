import type { TaskActivity } from '~/core/tasks/tasks.types';

type TaskDetailHistoryProps = {
  activities: TaskActivity[];
};

function formatActivityAction(action: TaskActivity['action']) {
  switch (action) {
    case 'created':
      return 'Creo la task';
    case 'status-changed':
      return 'Cambio status';
    case 'priority-changed':
      return 'Cambio prioridad';
    case 'assignee-changed':
      return 'Reasigno responsable';
    case 'reordered':
      return 'Reordeno la task';
    case 'deleted':
      return 'Elimino la task';
    default:
      return 'Actualizo la task';
  }
}

export function TaskDetailHistory({ activities }: TaskDetailHistoryProps) {
  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Historial</h3>
      {activities.length === 0 ? (
        <p className="text-sm opacity-75">Sin movimientos por ahora.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((item) => (
            <li key={item.id} className="rounded border p-2 text-sm">
              <div className="font-medium">
                {item.actorEmail ?? 'Usuario'}: {formatActivityAction(item.action)}
              </div>
              <div className="text-xs opacity-70">
                {new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
