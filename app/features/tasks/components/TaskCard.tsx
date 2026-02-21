import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Task } from '~/core/tasks/tasks.types';
import { Badge } from '~/ui/primitives/badge';
import { Card, CardContent } from '~/ui/primitives/card';
import { Avatar, AvatarFallback } from '~/ui/primitives/avatar';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/ui/primitives/dropdown-menu';

type TaskCardProps = {
  task: Task;
  assigneeLabel?: string | null;
  compact?: boolean;
  onOpen?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
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
};

function priorityBadgeVariant(priority: Task['priority']): 'secondary' | 'outline' | 'destructive' {
  if (priority === 'critical') return 'destructive';
  if (priority === 'high') return 'secondary';
  return 'outline';
}

export function TaskCard({
  task,
  assigneeLabel,
  compact = false,
  onOpen,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const blockNextOpenRef = React.useRef(false);

  function handleCardOpen() {
    if (!onOpen) return;
    if (blockNextOpenRef.current) {
      blockNextOpenRef.current = false;
      return;
    }

    onOpen(task.id);
  }

  return (
    <>
      <Card
        className={`${compact ? 'gap-2 py-3' : 'gap-3 py-4'} ${onOpen ? 'cursor-pointer' : ''}`}
        onClick={handleCardOpen}
      >
        <CardContent className={compact ? 'space-y-2 px-3' : 'space-y-3 px-4'}>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="text-sm font-semibold">{task.title}</div>
              {task.description ? <p className="text-xs opacity-80">{task.description}</p> : null}
            </div>

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
                    onEdit?.(task.id);
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

          <div className="flex items-center gap-2">
            <Badge variant={priorityBadgeVariant(task.priority)}>{PRIORITY_LABEL[task.priority]}</Badge>
            <Badge variant="outline">{STATUS_LABEL[task.status]}</Badge>
            <Badge variant="ghost">No labels</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>{(assigneeLabel ?? 'Unassigned').slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-[11px] opacity-80">{assigneeLabel ?? 'Unassigned'}</span>
            </div>
            <span className="text-[11px] opacity-70">Updated {task.updatedAt.toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        id={task.id}
        name="task"
        description={`Esta accion es permanente. Queres borrar "${task.title}"?`}
        onConfirm={() => {
          onDelete?.(task.id);
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
}
