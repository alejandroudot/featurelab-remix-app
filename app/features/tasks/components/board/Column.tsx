import type { Task } from '~/core/tasks/tasks.types';
import type { BoardColumn, BoardColumnId } from './utils';
import { CardItem } from './CardItem';

type ColumnProps = {
  column: BoardColumn;
  tasks: Task[];
  assigneeById: Record<string, string>;
  onColumnDrop: (toColumn: BoardColumnId) => void;
  onStartDrag: (taskId: string, fromColumn: BoardColumnId) => void;
  onDropAtTask: (taskId: string, toColumn: BoardColumnId, toIndex: number) => void;
  onOpenTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

export function Column({
  column,
  tasks,
  assigneeById,
  onColumnDrop,
  onStartDrag,
  onDropAtTask,
  onOpenTask,
  onEditTask,
  onDeleteTask,
}: ColumnProps) {
  return (
    <article
      className="space-y-2 rounded border p-3"
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onColumnDrop(column.id);
      }}
    >
      <h3 className="font-medium">{column.title}</h3>
      {tasks.length === 0 ? (
        <p className="text-xs opacity-70">Sin tasks en esta columna.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <CardItem
              key={task.id}
              task={task}
              columnId={column.id}
              assigneeLabel={task.assigneeId ? assigneeById[task.assigneeId] ?? null : null}
              onStartDrag={onStartDrag}
              onDropAtTask={(taskId) => {
                onDropAtTask(taskId, column.id, index);
              }}
              onOpenTask={onOpenTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      )}
    </article>
  );
}

