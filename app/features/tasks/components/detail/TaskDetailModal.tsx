import { useFetcher, useLocation } from 'react-router';
import type { Task, TaskActivity } from '~/core/tasks/tasks.types';
import type { TaskActionData, TaskAssigneeOption } from '../../types';
import { Badge } from '~/ui/primitives/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/ui/primitives/dialog';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import React from 'react';

type TaskDetailModalProps = {
  task: Task | null;
  currentUserId: string;
  activities: TaskActivity[];
  assignableUsers: TaskAssigneeOption[];
  open: boolean;
  onDeleteTask?: (taskId: string) => void;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetailModal({
  task,
  currentUserId,
  activities,
  assignableUsers,
  open,
  onDeleteTask,
  onOpenChange,
}: TaskDetailModalProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const isSubmitting = fetcher.state === 'submitting';
  const redirectTo = `${location.pathname}${location.search}`;
  const assigneeLabel = task?.assigneeId
    ? (assignableUsers.find((user) => user.id === task.assigneeId)?.email ?? 'Assigned')
    : 'Unassigned';
  const isCreator = task?.userId === currentUserId;
  const formActionData = fetcher.data;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  function formatActivityAction(action: TaskActivity['action']) {
    switch (action) {
      case 'created':
        return 'Creó la task';
      case 'status-changed':
        return 'Cambió status';
      case 'priority-changed':
        return 'Cambió prioridad';
      case 'assignee-changed':
        return 'Reasignó responsable';
      case 'reordered':
        return 'Reordenó la task';
      case 'deleted':
        return 'Eliminó la task';
      default:
        return 'Actualizó la task';
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] w-full max-w-5xl p-0 sm:max-w-5xl">
        {task ? (
          <>
            <DialogHeader className="border-b p-4">
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription>
                Detalle de task estilo Jira: contenido principal + panel lateral.
              </DialogDescription>
            </DialogHeader>
            <div className="grid h-[calc(80vh-96px)] gap-4 p-4 lg:grid-cols-[2fr_1fr]">
              <section className="space-y-4 overflow-y-auto pr-1">
                <div className="rounded border p-3">
                  <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
                  <p className="text-sm opacity-85">
                    {task.description || 'Sin descripcion por ahora.'}
                  </p>
                </div>

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
              </section>

              <aside className="space-y-3 overflow-y-auto rounded border p-3">
                <div className="flex flex-col ">
                  <h3 className="text-sm font-semibold">Acciones rapidas</h3>
                  <div className=" py-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <Badge variant="secondary">{task.priority}</Badge>
                      <Badge variant="ghost">{assigneeLabel}</Badge>
                    </div>
                  </div>
                  <fetcher.Form method="post" className="space-y-3 pt-3">
                    <input type="hidden" name="intent" value="update" />
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />

                    <label className="block text-xs font-medium" htmlFor="detail-status">
                      Status
                    </label>
                    <select
                      id="detail-status"
                      name="status"
                      defaultValue={task.status}
                      className="w-full rounded border px-2 py-1 text-sm"
                    >
                      <option value="todo">todo</option>
                      <option value="in-progress">in-progress</option>
                      <option value="qa">qa</option>
                      <option value="ready-to-go-live">ready-to-go-live</option>
                      <option value="done">done</option>
                      <option value="discarded">discarded</option>
                    </select>

                    <label className="block text-xs font-medium" htmlFor="detail-priority">
                      Priority
                    </label>
                    <select
                      id="detail-priority"
                      name="priority"
                      defaultValue={task.priority}
                      className="w-full rounded border px-2 py-1 text-sm"
                    >
                      <option value="low">low</option>
                      <option value="medium">medium</option>
                      <option value="high">high</option>
                      <option value="critical">critical</option>
                    </select>
                    {isCreator && (
                      <>
                        <label className="block text-xs font-medium" htmlFor="detail-assignee">
                          Responsible
                        </label>
                        <select
                          id="detail-assignee"
                          name="assigneeId"
                          defaultValue={task.assigneeId ?? ''}
                          className="w-full rounded border px-2 py-1 text-sm"
                        >
                          <option value="">Unassigned</option>
                          {assignableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.email}
                            </option>
                          ))}
                        </select>{' '}
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded border px-2 py-1 text-sm font-medium mt-1"
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </button>

                    {formActionData?.success === false ? (
                      <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
                        {formActionData.formError}
                      </div>
                    ) : null}
                  </fetcher.Form>
                </div>
                {isCreator && (
                  <>
                    <button
                      type="button"
                      className="w-full rounded border px-2 py-1 text-sm font-medium bg-destructive"
                      onClick={() => {
                        setTimeout(() => setIsDeleteDialogOpen(true), 0);
                      }}
                    >
                      {'Borrar Tarea'}
                    </button>
                    <DeleteDialog
                      open={isDeleteDialogOpen}
                      onOpenChange={setIsDeleteDialogOpen}
                      id={task.id}
                      name="task"
                      description={`Esta accion es permanente. Queres borrar "${task.title}"?`}
                      onConfirm={() => {
                        onDeleteTask?.(task.id);
                        setIsDeleteDialogOpen(false);
                      }}
                    />
                  </>
                )}
              </aside>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
