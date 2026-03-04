import { useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Task, TaskStatus } from '~/core/task/task.types';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { Badge } from '~/ui/primitives/badge';
import { Card as UiCard, CardContent } from '~/ui/primitives/card';
import { Avatar, AvatarFallback } from '~/ui/primitives/avatar';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import { formatDateUTC, isTaskOverdue } from '~/features/task/utils/task-due-date';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/ui/primitives/dropdown-menu';

type TaskBoardColumnId = Extract<TaskStatus, 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live'>;

type TaskBoardCardProps = {
  task: Task;
  columnId: TaskBoardColumnId;
  assigneeLabel?: string | null;
  onStartDrag: (taskId: string, fromColumn: TaskBoardColumnId) => void;
  onDropAtTask: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const STATUS_LABEL: Record<Task['status'], string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  qa: 'QA',
  'ready-to-go-live': 'Ready to Go Live',
  done: 'Done',
  discarded: 'Discarded',
};

function priorityBadgeVariant(priority: Task['priority']): 'secondary' | 'outline' | 'destructive' {
  if (priority === 'critical') return 'destructive';
  if (priority === 'high') return 'secondary';
  return 'outline';
}

export function TaskBoardCard({
  task,
  columnId,
  assigneeLabel,
  onStartDrag,
  onDropAtTask,
  onDeleteTask,
}: TaskBoardCardProps) {
  const openTaskDetail = useWorkspaceUiStore((state) => state.openTaskDetail);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const blockNextOpenRef = useRef(false);
  const overdue = isTaskOverdue(task);
  const checklistDone = task.checklist.filter((item) => item.done).length;

  function handleCardOpen() {
    if (blockNextOpenRef.current) {
      blockNextOpenRef.current = false;
      return;
    }
    openTaskDetail(task.id);
  }

  return (
    <>
      <li
        draggable
        onPointerDown={() => {
          onStartDrag(task.id, columnId);
        }}
        onDragStart={(event) => {
          onStartDrag(task.id, columnId);
          event.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDropAtTask(task.id);
        }}
      >
        <UiCard className="cursor-pointer gap-2 py-3" onClick={handleCardOpen}>
          <CardContent className="space-y-2 px-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold">{task.title}</div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Acciones de la task"
                  className="hover:bg-accent inline-flex size-6 items-center justify-center rounded-md"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.stopPropagation();
                      openTaskDetail(task.id);
                    }}
                  >
                    Editar task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(event) => {
                      event.stopPropagation();
                      blockNextOpenRef.current = true;
                      setTimeout(() => setIsDeleteDialogOpen(true), 0);
                    }}
                  >
                    Borrar task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={priorityBadgeVariant(task.priority)}>{PRIORITY_LABEL[task.priority]}</Badge>
              <Badge variant="outline">{STATUS_LABEL[task.status]}</Badge>
              {task.dueDate ? (
                <Badge variant={overdue ? 'destructive' : 'outline'}>
                  Due {formatDateUTC(task.dueDate)}
                </Badge>
              ) : null}
              {task.labels.length === 0 ? (
                <Badge variant="ghost">No labels</Badge>
              ) : (
                task.labels.map((label) => (
                  <Badge key={label} variant="outline">
                    #{label}
                  </Badge>
                ))
              )}
              {task.checklist.length > 0 ? (
                <Badge variant="outline">
                  Checklist {checklistDone}/{task.checklist.length}
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{(assigneeLabel ?? 'Unassigned').slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-[11px] opacity-80">{assigneeLabel ?? 'Unassigned'}</span>
              </div>
              <span className="text-[11px] opacity-70">Updated {formatDateUTC(task.updatedAt)}</span>
            </div>
          </CardContent>
        </UiCard>
      </li>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        name="task"
        description={`Esta accion es permanente. Queres borrar "${task.title}"?`}
        onConfirm={() => {
          onDeleteTask?.(task.id);
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
}
