import type { Task } from '~/core/task/task.types';
import { formatDateUTC, isTaskOverdue } from '~/features/task/utils/task-due-date';
import {
  formatChecklistSummary,
  formatLabelsSummary,
  formatPlainDescription,
  formatPriorityLabel,
  formatStatusLabel,
} from '~/features/task/utils/formatters';
import { Badge } from '~/ui/primitives/badge';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';

type TaskListCardItemProps = {
  task: Task;
  assigneeLabel: string;
  onDeleteTask?: (taskId: string) => void;
};

export function ListCard({ task, assigneeLabel, onDeleteTask }: TaskListCardItemProps) {
  const openTaskDetail = useWorkspaceUiStore((state) => state.openTaskDetail);
  const description = formatPlainDescription(task.description ?? '');

  return (
    <li
      className="rounded border bg-card p-3 transition-colors hover:bg-accent/30"
      onClick={() => openTaskDetail(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openTaskDetail(task.id);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="font-medium">{task.title}</div>
          {description ? <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <button
          type="button"
          className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
          onClick={(event) => {
            event.stopPropagation();
            if (!confirm('Eliminar esta task?')) return;
            onDeleteTask?.(task.id);
          }}
        >
          Eliminar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{formatStatusLabel(task.status)}</Badge>
        <Badge variant="secondary">{formatPriorityLabel(task.priority)}</Badge>
        {task.dueDate ? (
          <Badge variant={isTaskOverdue(task) ? 'destructive' : 'outline'}>
            Due {formatDateUTC(task.dueDate)}
          </Badge>
        ) : null}
        <Badge variant="outline">Responsible: {assigneeLabel}</Badge>
        <Badge variant="outline">Labels: {formatLabelsSummary(task.labels)}</Badge>
        <Badge variant="outline">Checklist: {formatChecklistSummary(task.checklist)}</Badge>
      </div>
    </li>
  );
}
