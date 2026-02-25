import React from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData, TaskAssigneeOption } from '../../types';
import { Badge } from '~/ui/primitives/badge';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import { formatDateUTC, isTaskOverdue } from '../utils/task-due-date';

type TaskDetailActionsProps = {
  task: Task;
  currentUserId: string;
  assignableUsers: TaskAssigneeOption[];
  onDeleteTask?: (taskId: string) => void;
};

export function TaskDetailActions({
  task,
  currentUserId,
  assignableUsers,
  onDeleteTask,
}: TaskDetailActionsProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const isSubmitting = fetcher.state === 'submitting';
  const redirectTo = `${location.pathname}${location.search}`;
  const assigneeLabel = task.assigneeId
    ? (assignableUsers.find((user) => user.id === task.assigneeId)?.email ?? 'Assigned')
    : 'Unassigned';
  const isCreator = task.userId === currentUserId;
  const formActionData = fetcher.data;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const overdue = isTaskOverdue(task);

  return (
    <aside className="flex flex-col justify-between space-y-3 overflow-y-auto rounded border p-3">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">Acciones rapidas</h3>
        <div className="py-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{task.status}</Badge>
            <Badge variant="secondary">{task.priority}</Badge>
            {task.dueDate ? (
              <Badge variant={overdue ? 'destructive' : 'outline'}>
                Due {formatDateUTC(task.dueDate)}
              </Badge>
            ) : null}
            {task.labels.map((label) => (
              <Badge key={label} variant="outline">
                #{label}
              </Badge>
            ))}
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

          <label className="block text-xs font-medium" htmlFor="detail-due-date">
            Due date
          </label>
          <input
            id="detail-due-date"
            type="date"
            name="dueDate"
            defaultValue={task.dueDate ? task.dueDate.toISOString().slice(0, 10) : ''}
            className="w-full rounded border px-2 py-1 text-sm"
          />

          <label className="block text-xs font-medium" htmlFor="detail-labels">
            Labels (comma separated)
          </label>
          <input
            id="detail-labels"
            type="text"
            name="labels"
            defaultValue={task.labels.join(', ')}
            className="w-full rounded border px-2 py-1 text-sm"
            placeholder="frontend, bug, urgente"
          />
          {isCreator ? (
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
              </select>
            </>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-slate-900 px-2 py-1 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
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
      {isCreator ? (
        <>
          <button
            type="button"
            className="w-full rounded border bg-destructive px-2 py-1 text-sm font-medium"
            onClick={() => {
              setTimeout(() => setIsDeleteDialogOpen(true), 0);
            }}
          >
            Borrar Tarea
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
      ) : null}
    </aside>
  );
}
