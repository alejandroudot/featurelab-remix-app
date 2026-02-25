import type { Task, TaskActivity, TaskComment } from '~/core/tasks/tasks.types';
import type { TaskAssigneeOption } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '~/ui/primitives/dialog';
import { TaskDetailActions } from './TaskDetailActions';
import { TaskDetailContent } from './TaskDetailContent';
import { TaskDetailComments } from './TaskDetailComments';
import { TaskDetailHistory } from './TaskDetailHistory';
import { TaskDetailEditableTitle } from './TaskDetailEditableTitle';

type TaskDetailModalProps = {
  task: Task | null;
  currentUserId: string;
  activities: TaskActivity[];
  comments: TaskComment[];
  assignableUsers: TaskAssigneeOption[];
  open: boolean;
  onDeleteTask?: (taskId: string) => void;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetailModal({
  task,
  currentUserId,
  activities,
  comments,
  assignableUsers,
  open,
  onDeleteTask,
  onOpenChange,
}: TaskDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] w-full max-w-5xl p-0 sm:max-w-5xl">
        {task ? (
          <>
            <DialogHeader className="border-b p-4">
              <TaskDetailEditableTitle taskId={task.id} title={task.title} />
              <DialogDescription>
                Detalle de task estilo Jira: contenido principal + panel lateral.
              </DialogDescription>
            </DialogHeader>
            <div className="grid h-[calc(80vh-96px)] gap-4 p-4 lg:grid-cols-[2fr_1fr]">
              <section className="space-y-4 overflow-y-auto pr-1">
                <TaskDetailContent task={task} />
                <TaskDetailComments taskId={task.id} comments={comments} currentUserId={currentUserId} />
                <TaskDetailHistory activities={activities} />
              </section>

              <TaskDetailActions
                task={task}
                currentUserId={currentUserId}
                assignableUsers={assignableUsers}
                onDeleteTask={onDeleteTask}
              />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
