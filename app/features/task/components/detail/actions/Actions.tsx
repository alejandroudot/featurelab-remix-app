import { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import type { Task } from '~/core/task/task.types';
import type { TaskAssigneeOption } from '../../../types';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { Checklist } from './Checklist';
import { QuickFields } from './QuickFields';
import { DeleteSection } from './DeleteSection';
import { useUpdateTaskMutation } from '~/features/task/client/mutation';

type ActionsProps = {
  task: Task;
  currentUserId: string;
  assignableUsers: TaskAssigneeOption[];
  onDeleteTask?: (taskId: string) => void;
};

export function Actions({
  task,
  currentUserId,
  assignableUsers,
  onDeleteTask,
}: ActionsProps) {
  const { data: actionData, mutateAsync: updateTask } = useUpdateTaskMutation();
  const revalidator = useRevalidator();
  const isCreator = task.userId === currentUserId;
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [checklist, setChecklist] = useState(task.checklist);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [statusDraft, setStatusDraft] = useState(task.status);
  const [priorityDraft, setPriorityDraft] = useState(task.priority);
  const [dueDateDraft, setDueDateDraft] = useState(
    task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '',
  );
  const [labelsDraft, setLabelsDraft] = useState(task.labels.join(', '));
  const [assigneeDraft, setAssigneeDraft] = useState(task.assigneeId ?? '');

  useEffect(() => {
    setChecklist(task.checklist);
    setNewChecklistText('');
    setStatusDraft(task.status);
    setPriorityDraft(task.priority);
    setDueDateDraft(task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '');
    setLabelsDraft(task.labels.join(', '));
    setAssigneeDraft(task.assigneeId ?? '');
  }, [task]);

  async function submitPartialUpdate(values: Record<string, string>) {
    const result = await updateTask({
      id: task.id,
      ...values,
    });
    if (!result || !result.success) return;
    revalidator.revalidate();
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
    void submitPartialUpdate({ checklist: JSON.stringify(nextChecklist) });
  }

  function toggleChecklistItem(itemId: string) {
    const nextChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item,
    );
    setChecklist(nextChecklist);
    void submitPartialUpdate({ checklist: JSON.stringify(nextChecklist) });
  }

  function removeChecklistItem(itemId: string) {
    const nextChecklist = checklist.filter((item) => item.id !== itemId);
    setChecklist(nextChecklist);
    void submitPartialUpdate({ checklist: JSON.stringify(nextChecklist) });
  }

  return (
    <aside className="self-start space-y-3 rounded border p-3">
      <button
        type="button"
        onClick={() => setIsDetailsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between rounded border px-2 py-1 text-left text-sm font-semibold hover:bg-accent/40"
      >
        <span>Details</span>
        <span aria-hidden>{isDetailsExpanded ? '▾' : '▸'}</span>
      </button>
      {isDetailsExpanded ? (
        <div className="space-y-3">
          <QuickFields
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

          <Checklist
            checklist={checklist}
            newChecklistText={newChecklistText}
            onNewChecklistTextChange={setNewChecklistText}
            onAddChecklistItem={addChecklistItem}
            onToggleChecklistItem={toggleChecklistItem}
            onRemoveChecklistItem={removeChecklistItem}
          />

          <ActionFeedbackText
            actionData={actionData}
            showFormError
            errorClassName="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700"
          />

          {isCreator ? (
            <DeleteSection taskId={task.id} taskTitle={task.title} onDeleteTask={onDeleteTask} />
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
