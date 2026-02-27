import React from 'react';
import type { TaskActivity } from '~/core/tasks/tasks.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/ui/primitives/dialog';

type HistoryProps = {
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
    case 'comment-added':
      return 'Agrego un comentario';
    case 'comment-updated':
      return 'Edito un comentario';
    case 'comment-deleted':
      return 'Borro un comentario';
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

function formatActivity(item: TaskActivity) {
  if (item.action === 'updated' && item.metadata?.kind === 'mention') {
    const source = item.metadata?.source;
    return source === 'description' ? 'Menciono en descripcion' : 'Menciono en comentario';
  }
  return formatActivityAction(item.action);
}

export function History({ activities }: HistoryProps) {
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
                Ultima: {latest.actorEmail ?? 'Usuario'} - {formatActivity(latest)}
              </div>
            ) : null}
          </button>

          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogContent className="w-[min(500px,calc(100vw-2rem))] overflow-hidden p-0">
              <DialogHeader className="border-b px-6 py-4">
                <DialogTitle>Historial de actualizaciones</DialogTitle>
                <DialogDescription>
                  Eventos recientes de la task, ordenados del mas nuevo al mas viejo.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[62vh] overflow-y-auto px-6 py-4 [scrollbar-gutter:stable]">
                <ul className="space-y-2">
                  {activities.map((item) => (
                    <li key={item.id} className="rounded border p-2 text-sm">
                      <div className="font-medium">
                        {item.actorEmail ?? 'Usuario'}: {formatActivity(item)}
                      </div>
                      <div className="text-xs opacity-70">
                        {new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

