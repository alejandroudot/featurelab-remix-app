import type { Task } from '~/core/tasks/tasks.types';
import { Badge } from '~/ui/primitives/badge';
import { Card, CardContent } from '~/ui/primitives/card';

type TaskCardProps = {
  task: Task;
  compact?: boolean;
};

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

function priorityBadgeVariant(priority: Task['priority']): 'secondary' | 'outline' | 'destructive' {
  if (priority === 'critical') return 'destructive';
  if (priority === 'high') return 'secondary';
  return 'outline';
}

export function TaskCard({ task, compact = false }: TaskCardProps) {
  return (
    <Card className={compact ? 'gap-2 py-3' : 'gap-3 py-4'}>
      <CardContent className={compact ? 'space-y-2 px-3' : 'space-y-3 px-4'}>
        <div className="space-y-1">
          <div className="text-sm font-semibold">{task.title}</div>
          {task.description ? <p className="text-xs opacity-80">{task.description}</p> : null}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={priorityBadgeVariant(task.priority)}>{PRIORITY_LABEL[task.priority]}</Badge>
          <span className="text-[11px] opacity-70">Updated {task.updatedAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
