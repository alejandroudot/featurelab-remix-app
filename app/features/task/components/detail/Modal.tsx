import { useMemo, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
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
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';
import { useWorkspaceDataStore } from '~/features/project/store/data.store';
import type { TaskActionData } from '../../types';

export function Modal() {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const { isDetailOpen, selectedTaskId, setDetailOpen } = useWorkspaceUiStore(
    useShallow((state) => ({
      isDetailOpen: state.isDetailOpen,
      selectedTaskId: state.selectedTaskId,
      setDetailOpen: state.setDetailOpen,
    })),
  );
  const { currentUserId, tasks, taskActivities, taskComments, assignableUsers } = useWorkspaceDataStore(
    useShallow((state) => ({
      currentUserId: state.currentUserId,
      tasks: state.tasks,
      taskActivities: state.taskActivities,
      taskComments: state.taskComments,
      assignableUsers: state.assignableUsers,
    })),
  );
  const [closeSignal, setCloseSignal] = useState(0);
  const task = useMemo(() => tasks.find((candidate) => candidate.id === selectedTaskId) ?? null, [tasks, selectedTaskId]);
  const activities = useMemo(
    () => (selectedTaskId ? taskActivities.filter((activity) => activity.taskId === selectedTaskId) : []),
    [selectedTaskId, taskActivities],
  );
  const comments = useMemo(
    () => (selectedTaskId ? taskComments.filter((comment) => comment.taskId === selectedTaskId) : []),
    [selectedTaskId, taskComments],
  );
  const mentionCandidates = useMemo(
    () => [...new Set(assignableUsers.map((user) => user.email.toLowerCase()))],
    [assignableUsers],
  );

  function handleDeleteTask(taskId: string) {
    fetcher.submit(
      { intent: 'delete', id: taskId, redirectTo: `${location.pathname}${location.search}` },
      { method: 'post', action: '/api/tasks' },
    );
  }

  function handleModalOpenChange(nextOpen: boolean) {
    if (!nextOpen && typeof document !== 'undefined') {
      setCloseSignal((prev) => prev + 1);
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }
    setDetailOpen(nextOpen);
  }

  return (
    <Dialog open={isDetailOpen} onOpenChange={handleModalOpenChange}>
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
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}


