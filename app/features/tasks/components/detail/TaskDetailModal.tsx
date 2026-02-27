import { useMemo, useState } from 'react';
import type { Task, TaskActivity, TaskComment } from '~/core/tasks/tasks.types';
import type { TaskAssigneeOption } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '~/ui/primitives/dialog';
import { TaskDetailActions } from './task-detail-actions/TaskDetailActions';
import { TaskDetailDescription } from './task-detail-description/TaskDetailDescription';
import { TaskDetailComments } from './task-detail-comments/TaskDetailComments';
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
  const [closeSignal, setCloseSignal] = useState(0);
  const mentionCandidates = useMemo(
    () => [...new Set(assignableUsers.map((user) => user.email.toLowerCase()))],
    [assignableUsers],
  );

  function handleModalOpenChange(nextOpen: boolean) {
    if (!nextOpen && typeof document !== 'undefined') {
      setCloseSignal((prev) => prev + 1);
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogContent className="h-[80vh] w-full max-w-5xl p-0 sm:max-w-5xl">
        {task ? (
          <>
            <DialogHeader className="border-b p-4">
              <TaskDetailEditableTitle taskId={task.id} title={task.title} closeSignal={closeSignal} />
              <DialogDescription>
                Detalle de task estilo Jira: contenido principal + panel lateral.
              </DialogDescription>
            </DialogHeader>
            <div className="grid h-[calc(80vh-96px)] gap-4 p-4 lg:grid-cols-[2fr_1fr]">
              <section className="space-y-4 overflow-y-auto pr-1">
                <TaskDetailDescription
                  task={task}
                  mentionCandidates={mentionCandidates}
                  closeSignal={closeSignal}
                />
                <TaskDetailComments
                  taskId={task.id}
                  comments={comments}
                  currentUserId={currentUserId}
                  mentionCandidates={mentionCandidates}
                  closeSignal={closeSignal}
                />
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
