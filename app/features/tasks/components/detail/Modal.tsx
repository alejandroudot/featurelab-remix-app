import { useMemo, useState } from 'react';
import type { Task, TaskActivity, TaskComment } from '~/core/tasks/tasks.types';
import type { TaskAssigneeOption } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '~/ui/primitives/dialog';
import { Actions } from './actions/Actions';
import { Description } from './description/Description';
import { Comments } from './comments/Comments';
import { History } from './History';
import { EditableTitle } from './EditableTitle';

type ModalProps = {
  task: Task | null;
  currentUserId: string;
  activities: TaskActivity[];
  comments: TaskComment[];
  assignableUsers: TaskAssigneeOption[];
  open: boolean;
  onDeleteTask?: (taskId: string) => void;
  onOpenChange: (open: boolean) => void;
};

export function Modal({
  task,
  currentUserId,
  activities,
  comments,
  assignableUsers,
  open,
  onDeleteTask,
  onOpenChange,
}: ModalProps) {
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
      <DialogContent className="h-[80vh] w-full max-w-5xl overflow-hidden p-0 sm:max-w-5xl">
        {task ? (
          <>
            <DialogHeader className="border-b p-4">
              <EditableTitle taskId={task.id} title={task.title} closeSignal={closeSignal} />
              <DialogDescription>
                Detalle de task estilo Jira: contenido principal + panel lateral.
              </DialogDescription>
            </DialogHeader>
            <div className="grid h-[calc(80vh-96px)] gap-4 p-4 lg:grid-cols-[2fr_1fr]">
              <section className="min-h-0 space-y-4 overflow-y-auto pr-2 [scrollbar-gutter:stable]">
                <Description
                  task={task}
                  mentionCandidates={mentionCandidates}
                  closeSignal={closeSignal}
                />
                <Comments
                  taskId={task.id}
                  comments={comments}
                  currentUserId={currentUserId}
                  mentionCandidates={mentionCandidates}
                  closeSignal={closeSignal}
                />
                <History activities={activities} />
              </section>

              <div className="min-h-0 overflow-y-auto pr-2 [scrollbar-gutter:stable]">
                <Actions
                  task={task}
                  currentUserId={currentUserId}
                  assignableUsers={assignableUsers}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

