import React from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData, TaskAssigneeOption } from '../../types';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';

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
  const isCreator = task.userId === currentUserId;
  const formActionData = fetcher.data;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [checklist, setChecklist] = React.useState(task.checklist);
  const [newChecklistText, setNewChecklistText] = React.useState('');
  const [statusDraft, setStatusDraft] = React.useState(task.status);
  const [priorityDraft, setPriorityDraft] = React.useState(task.priority);
  const [dueDateDraft, setDueDateDraft] = React.useState(
    task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '',
  );
  const [labelsDraft, setLabelsDraft] = React.useState(task.labels.join(', '));
  const [assigneeDraft, setAssigneeDraft] = React.useState(task.assigneeId ?? '');

  React.useEffect(() => {
    setChecklist(task.checklist);
    setNewChecklistText('');
    setStatusDraft(task.status);
    setPriorityDraft(task.priority);
    setDueDateDraft(task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '');
    setLabelsDraft(task.labels.join(', '));
    setAssigneeDraft(task.assigneeId ?? '');
  }, [task]);

  function submitPartialUpdate(values: Record<string, string>) {
    fetcher.submit(
      {
        intent: 'update',
        id: task.id,
        redirectTo,
        ...values,
      },
      { method: 'post' },
    );
  }

  function addChecklistItem() {
    const text = newChecklistText.trim();
    if (!text) return;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nextChecklist = [...checklist, { id, text, done: false }];
    setChecklist(nextChecklist);
    setNewChecklistText('');
    submitPartialUpdate({ checklist: JSON.stringify(nextChecklist) });
  }

  function toggleChecklistItem(itemId: string) {
    const nextChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item,
    );
    setChecklist(nextChecklist);
    submitPartialUpdate({ checklist: JSON.stringify(nextChecklist) });
  }

  function removeChecklistItem(itemId: string) {
    const nextChecklist = checklist.filter((item) => item.id !== itemId);
    setChecklist(nextChecklist);
    submitPartialUpdate({ checklist: JSON.stringify(nextChecklist) });
  }

  return (
    <aside className="flex flex-col justify-between space-y-3 overflow-y-auto rounded border p-3">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">Acciones rapidas</h3>
        <div className="space-y-3 pt-3">
          <label className="block text-xs font-medium" htmlFor="detail-status">
            Status
          </label>
          <select
            id="detail-status"
            value={statusDraft}
            onChange={(event) =>
              setStatusDraft(
                event.target.value as
                  | 'todo'
                  | 'in-progress'
                  | 'qa'
                  | 'ready-to-go-live'
                  | 'done'
                  | 'discarded',
              )
            }
            onBlur={() => {
              if (statusDraft === task.status) return;
              submitPartialUpdate({ status: statusDraft });
            }}
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
            value={priorityDraft}
            onChange={(event) =>
              setPriorityDraft(
                event.target.value as 'low' | 'medium' | 'high' | 'critical',
              )
            }
            onBlur={() => {
              if (priorityDraft === task.priority) return;
              submitPartialUpdate({ priority: priorityDraft });
            }}
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
            value={dueDateDraft}
            onChange={(event) => setDueDateDraft(event.target.value)}
            onBlur={() => {
              const taskDueDate = task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '';
              if (dueDateDraft === taskDueDate) return;
              submitPartialUpdate({ dueDate: dueDateDraft });
            }}
            className="w-full rounded border px-2 py-1 text-sm"
          />

          <label className="block text-xs font-medium" htmlFor="detail-labels">
            Labels (comma separated)
          </label>
          <input
            id="detail-labels"
            type="text"
            value={labelsDraft}
            onChange={(event) => setLabelsDraft(event.target.value)}
            onBlur={() => {
              if (labelsDraft.trim() === task.labels.join(', ')) return;
              submitPartialUpdate({ labels: labelsDraft });
            }}
            className="w-full rounded border px-2 py-1 text-sm"
            placeholder="frontend, bug, urgente"
          />

          <div className="space-y-2">
            <label className="block text-xs font-medium">Checklist / subtareas</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(event) => setNewChecklistText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addChecklistItem();
                  }
                }}
                className="w-full rounded border px-2 py-1 text-sm"
                placeholder="Agregar subtarea..."
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="rounded border px-2 py-1 text-sm"
              >
                Agregar
              </button>
            </div>
            {checklist.length > 0 ? (
              <ul className="space-y-1">
                {checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 rounded border px-2 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className={item.done ? 'line-through opacity-70' : ''}>{item.text}</span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="ml-auto text-xs opacity-70 hover:opacity-100"
                    >
                      quitar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs opacity-70">Sin subtareas.</p>
            )}
          </div>
          {isCreator ? (
            <>
              <label className="block text-xs font-medium" htmlFor="detail-assignee">
                Responsible
              </label>
              <select
                id="detail-assignee"
                value={assigneeDraft}
                onChange={(event) => setAssigneeDraft(event.target.value)}
                onBlur={() => {
                  if (assigneeDraft === (task.assigneeId ?? '')) return;
                  submitPartialUpdate({ assigneeId: assigneeDraft });
                }}
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
          <p className="text-xs opacity-70">{isSubmitting ? 'Guardando cambios...' : 'Autoguardado al salir del campo'}</p>

          {formActionData?.success === false ? (
            <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
              {formActionData.formError}
            </div>
          ) : null}
        </div>
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
