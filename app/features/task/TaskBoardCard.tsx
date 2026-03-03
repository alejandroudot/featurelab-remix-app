import type { Task, TaskStatus } from '~/core/task/task.types';
import { TaskCard } from '~/features/task/components/card/TaskCard';
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';

type TaskBoardColumnId = Extract<TaskStatus, 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live'>;

type TaskBoardCardProps = {
  task: Task;
  columnId: TaskBoardColumnId;
  assigneeLabel?: string | null;
  onStartDrag: (taskId: string, fromColumn: TaskBoardColumnId) => void;
  onDropAtTask: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

export function TaskBoardCard({
  task,
  columnId,
  assigneeLabel,
  onStartDrag,
  onDropAtTask,
  onDeleteTask,
}: TaskBoardCardProps) {
  const openTaskDetail = useWorkspaceUiStore((state) => state.openTaskDetail);
  return (
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
      <TaskCard
        task={task}
        assigneeLabel={assigneeLabel}
        compact
        onOpen={openTaskDetail}
        onEdit={openTaskDetail}
        onDelete={onDeleteTask}
      />
    </li>
  );
}
