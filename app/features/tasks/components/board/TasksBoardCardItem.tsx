import type { Task } from '~/core/tasks/tasks.types';
import type { BoardColumnId } from './tasks-board.utils';
import { TaskCard } from '../card/TaskCard';

type TasksBoardCardItemProps = {
  task: Task;
  columnId: BoardColumnId;
  assigneeLabel?: string | null;
  onStartDrag: (taskId: string, fromColumn: BoardColumnId) => void;
  onDropAtTask: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

export function TasksBoardCardItem({
  task,
  columnId,
  assigneeLabel,
  onStartDrag,
  onDropAtTask,
  onOpenTask,
  onEditTask,
  onDeleteTask,
}: TasksBoardCardItemProps) {
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
        onOpen={onOpenTask}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
      />
    </li>
  );
}
