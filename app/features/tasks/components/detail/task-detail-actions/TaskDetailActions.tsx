import React from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData, TaskAssigneeOption } from '../../../types';
import { TaskDetailChecklist } from './TaskDetailChecklist';
import { TaskDetailQuickFields } from './TaskDetailQuickFields';
import { TaskDetailDeleteSection } from './TaskDetailDeleteSection';

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
  const redirectTo = `${location.pathname}${location.search}`;
  const isCreator = task.userId === currentUserId;
  const formActionData = fetcher.data;
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
          <TaskDetailQuickFields
            task={task}
            isCreator={isCreator}
            assignableUsers={assignableUsers}
            statusDraft={statusDraft}
            priorityDraft={priorityDraft}
            dueDateDraft={dueDateDraft}
            labelsDraft={labelsDraft}
            assigneeDraft={assigneeDraft}
            onStatusChange={setStatusDraft}
            onPriorityChange={setPriorityDraft}
            onDueDateChange={setDueDateDraft}
            onLabelsChange={setLabelsDraft}
            onAssigneeChange={setAssigneeDraft}
            onSubmitPartialUpdate={submitPartialUpdate}
          />

          <TaskDetailChecklist
            checklist={checklist}
            newChecklistText={newChecklistText}
            onNewChecklistTextChange={setNewChecklistText}
            onAddChecklistItem={addChecklistItem}
            onToggleChecklistItem={toggleChecklistItem}
            onRemoveChecklistItem={removeChecklistItem}
          />

          {formActionData?.success === false ? (
            <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
              {formActionData.formError}
            </div>
          ) : null}
        </div>
      </div>

      {isCreator ? (
        <TaskDetailDeleteSection taskId={task.id} taskTitle={task.title} onDeleteTask={onDeleteTask} />
      ) : null}
    </aside>
  );
}

