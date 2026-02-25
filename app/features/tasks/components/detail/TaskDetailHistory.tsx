import React from 'react';
import type { TaskActivity } from '~/core/tasks/tasks.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/ui/primitives/dialog';

type TaskDetailHistoryProps = {
  activities: TaskActivity[];
};

function formatActivityAction(action: TaskActivity['action']) {
  switch (action) {
    case 'created':
      return 'Creo la task';
    case 'labels-changed':
      return 'Cambio labels';
    case 'checklist-changed':
      return 'Actualizo checklist';
    case 'due-date-changed':
      return 'Cambio la fecha limite';
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
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const latest = activities[0];

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Historial</h3>
      {activities.length === 0 ? (
        <p className="text-sm opacity-75">Sin movimientos por ahora.</p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="w-full rounded border p-2 text-left text-sm hover:bg-accent"
          >
            <div className="font-medium">Historial de actualizaciones ({activities.length})</div>
            {latest ? (
              <div className="text-xs opacity-70">
                Ultima: {latest.actorEmail ?? 'Usuario'} - {formatActivityAction(latest.action)}
              </div>
            ) : null}
          </button>

          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Historial de actualizaciones</DialogTitle>
                <DialogDescription>
                  Eventos recientes de la task, ordenados del mas nuevo al mas viejo.
                </DialogDescription>
              </DialogHeader>
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
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
