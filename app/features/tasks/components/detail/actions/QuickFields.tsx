import type { Task } from '~/core/tasks/tasks.types';
import type { TaskAssigneeOption } from '../../../types';

type QuickFieldsProps = {
  task: Task;
  isCreator: boolean;
  assignableUsers: TaskAssigneeOption[];
  statusDraft: Task['status'];
  priorityDraft: Task['priority'];
  dueDateDraft: string;
  labelsDraft: string;
  assigneeDraft: string;
  onStatusChange: (status: Task['status']) => void;
  onPriorityChange: (priority: Task['priority']) => void;
  onDueDateChange: (dueDate: string) => void;
  onLabelsChange: (labels: string) => void;
  onAssigneeChange: (assigneeId: string) => void;
  onSubmitPartialUpdate: (values: Record<string, string>) => void;
};

export function QuickFields({
  task,
  isCreator,
  assignableUsers,
  statusDraft,
  priorityDraft,
  dueDateDraft,
  labelsDraft,
  assigneeDraft,
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
  onLabelsChange,
  onAssigneeChange,
  onSubmitPartialUpdate,
}: QuickFieldsProps) {
  return (
    <div className="overflow-hidden rounded border">
      <div className="grid grid-cols-[110px_1fr] items-center gap-3 border-b px-3 py-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="detail-assignee">
          Assignee
        </label>
        {isCreator ? (
          <select
            id="detail-assignee"
            value={assigneeDraft}
            onChange={(event) => onAssigneeChange(event.target.value)}
            onBlur={() => {
              if (assigneeDraft === (task.assigneeId ?? '')) return;
              onSubmitPartialUpdate({ assigneeId: assigneeDraft });
            }}
            className="h-8 w-full rounded border px-2 text-sm"
          >
            <option value="">Unassigned</option>
            {assignableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm">{assigneeDraft || 'Unassigned'}</span>
        )}
      </div>

      <div className="grid grid-cols-[110px_1fr] items-center gap-3 border-b px-3 py-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="detail-labels">
          Labels
        </label>
        <input
          id="detail-labels"
          type="text"
          value={labelsDraft}
          onChange={(event) => onLabelsChange(event.target.value)}
          onBlur={() => {
            if (labelsDraft.trim() === task.labels.join(', ')) return;
            onSubmitPartialUpdate({ labels: labelsDraft });
          }}
          className="h-8 w-full rounded border px-2 text-sm"
          placeholder="frontend, bug"
        />
      </div>

      <div className="grid grid-cols-[110px_1fr] items-center gap-3 border-b px-3 py-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="detail-priority">
          Priority
        </label>
        <select
          id="detail-priority"
          value={priorityDraft}
          onChange={(event) => onPriorityChange(event.target.value as Task['priority'])}
          onBlur={() => {
            if (priorityDraft === task.priority) return;
            onSubmitPartialUpdate({ priority: priorityDraft });
          }}
          className="h-8 w-full rounded border px-2 text-sm"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="critical">critical</option>
        </select>
      </div>

      <div className="grid grid-cols-[110px_1fr] items-center gap-3 border-b px-3 py-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="detail-status">
          Status
        </label>
        <select
          id="detail-status"
          value={statusDraft}
          onChange={(event) => onStatusChange(event.target.value as Task['status'])}
          onBlur={() => {
            if (statusDraft === task.status) return;
            onSubmitPartialUpdate({ status: statusDraft });
          }}
          className="h-8 w-full rounded border px-2 text-sm"
        >
          <option value="todo">todo</option>
          <option value="in-progress">in-progress</option>
          <option value="qa">qa</option>
          <option value="ready-to-go-live">ready-to-go-live</option>
          <option value="done">done</option>
          <option value="discarded">discarded</option>
        </select>
      </div>

      <div className="grid grid-cols-[110px_1fr] items-center gap-3 px-3 py-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="detail-due-date">
          Due date
        </label>
        <input
          id="detail-due-date"
          type="date"
          value={dueDateDraft}
          onChange={(event) => onDueDateChange(event.target.value)}
          onBlur={() => {
            const taskDueDate = task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '';
            if (dueDateDraft === taskDueDate) return;
            onSubmitPartialUpdate({ dueDate: dueDateDraft });
          }}
          className="h-8 w-full rounded border px-2 text-sm"
        />
      </div>
    </div>
  );
}


